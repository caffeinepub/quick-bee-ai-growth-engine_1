import Map "mo:core/Map";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile
  type UserProfile = {
    name : Text;
    bio : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get their profile");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Enumerated types for Social Media Platforms and Post Status
  type SocialMediaPlatform = {
    #instagram;
    #facebook;
    #twitter;
    #linkedin;
    #tiktok;
    #youtube;
    #other;
  };

  type PostStatus = {
    #idea;
    #draft;
    #scheduled;
    #published;
    #cancelled;
  };

  // Social Media Post Idea
  type SocialMediaPost = {
    id : Nat;
    title : Text;
    caption : Text;
    platform : SocialMediaPlatform;
    status : PostStatus;
    scheduledDate : ?Int;
    tags : [Text];
    notes : Text;
    createdAt : Int;
    updatedAt : Int;
  };

  // Social Media Metrics Entry
  type SocialMediaMetrics = {
    id : Nat;
    platform : SocialMediaPlatform;
    date : Int;
    followers : Nat;
    impressions : Nat;
    reach : Nat;
    engagements : Nat;
    clicks : Nat;
    postsPublished : Nat;
    notes : Text;
    createdAt : Int;
  };

  // External Webhook Log Entry
  type WebhookLog = {
    id : Nat;
    toolName : Text;
    payload : Text;
    source : Text;
    timestamp : Int;
  };

  // Internal state
  var nextPostId = 1;
  var nextMetricsId = 1;
  var nextWebhookId = 1;

  let posts = Map.empty<Nat, SocialMediaPost>();
  let metrics = Map.empty<Nat, SocialMediaMetrics>();
  let webhookLogs = Map.empty<Nat, WebhookLog>();

  // Helper function to convert Int timestamps to Nat safely
  func timestampToNat(timestamp : Int) : Nat {
    if (timestamp < 0) { 0 } else { timestamp.toNat() };
  };

  // CRUD Operations for Social Media Posts

  public shared ({ caller }) func createPost(title : Text, caption : Text, platform : SocialMediaPlatform, status : PostStatus, scheduledDate : ?Int, tags : [Text], notes : Text) : async SocialMediaPost {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create posts");
    };
    let currentTime = timestampToNat(Time.now());

    let newPost : SocialMediaPost = {
      id = nextPostId;
      title;
      caption;
      platform;
      status;
      scheduledDate;
      tags;
      notes;
      createdAt = currentTime;
      updatedAt = currentTime;
    };
    posts.add(nextPostId, newPost);
    nextPostId += 1;
    newPost;
  };

  public query ({ caller }) func getPost(id : Nat) : async ?SocialMediaPost {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view posts");
    };
    posts.get(id);
  };

  public query ({ caller }) func getAllPosts() : async [SocialMediaPost] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view posts");
    };
    posts.values().toArray();
  };

  public shared ({ caller }) func updatePost(id : Nat, title : Text, caption : Text, platform : SocialMediaPlatform, status : PostStatus, scheduledDate : ?Int, tags : [Text], notes : Text) : async SocialMediaPost {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update posts");
    };
    switch (posts.get(id)) {
      case (null) { Runtime.trap("Post not found") };
      case (?existingPost) {
        let updatedPost : SocialMediaPost = {
          id;
          title;
          caption;
          platform;
          status;
          scheduledDate;
          tags;
          notes;
          createdAt = existingPost.createdAt;
          updatedAt = timestampToNat(Time.now());
        };
        posts.add(id, updatedPost);
        updatedPost;
      };
    };
  };

  public shared ({ caller }) func deletePost(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete posts");
    };
    if (not posts.containsKey(id)) { Runtime.trap("Post not found") };
    posts.remove(id);
  };

  // CRUD Operations for Social Media Metrics

  public shared ({ caller }) func createMetrics(platform : SocialMediaPlatform, date : Int, followers : Nat, impressions : Nat, reach : Nat, engagements : Nat, clicks : Nat, postsPublished : Nat, notes : Text) : async SocialMediaMetrics {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create metrics");
    };
    let currentTime = timestampToNat(Time.now());

    let newMetrics : SocialMediaMetrics = {
      id = nextMetricsId;
      platform;
      date;
      followers;
      impressions;
      reach;
      engagements;
      clicks;
      postsPublished;
      notes;
      createdAt = currentTime;
    };
    metrics.add(nextMetricsId, newMetrics);
    nextMetricsId += 1;
    newMetrics;
  };

  public query ({ caller }) func getMetrics(id : Nat) : async ?SocialMediaMetrics {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view metrics");
    };
    metrics.get(id);
  };

  public query ({ caller }) func getAllMetrics() : async [SocialMediaMetrics] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view metrics");
    };
    metrics.values().toArray();
  };

  public shared ({ caller }) func updateMetrics(id : Nat, platform : SocialMediaPlatform, date : Int, followers : Nat, impressions : Nat, reach : Nat, engagements : Nat, clicks : Nat, postsPublished : Nat, notes : Text) : async SocialMediaMetrics {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update metrics");
    };
    switch (metrics.get(id)) {
      case (null) { Runtime.trap("Metrics entry not found") };
      case (?existingMetrics) {
        let updatedMetrics : SocialMediaMetrics = {
          id;
          platform;
          date;
          followers;
          impressions;
          reach;
          engagements;
          clicks;
          postsPublished;
          notes;
          createdAt = existingMetrics.createdAt;
        };
        metrics.add(id, updatedMetrics);
        updatedMetrics;
      };
    };
  };

  public shared ({ caller }) func deleteMetrics(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete metrics");
    };
    if (not metrics.containsKey(id)) { Runtime.trap("Metrics entry not found") };
    metrics.remove(id);
  };

  // Webhook Handling (Separate from existing internal webhook logs)
  // receiveExternalWebhook is open to all callers including guests/external tools
  public shared ({ caller }) func receiveExternalWebhook(toolName : Text, payload : Text, source : Text) : async Nat {
    let logEntry : WebhookLog = {
      id = nextWebhookId;
      toolName;
      payload;
      source;
      timestamp = timestampToNat(Time.now());
    };
    webhookLogs.add(nextWebhookId, logEntry);
    let currentId = nextWebhookId;
    nextWebhookId += 1;
    currentId;
  };

  public query ({ caller }) func getExternalWebhookLogs() : async [WebhookLog] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view webhook logs");
    };
    webhookLogs.values().toArray();
  };

  public shared ({ caller }) func clearExternalWebhookLogs() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can clear webhook logs");
    };
    webhookLogs.clear();
  };

  // Export Data Method
  type ExportPayload = {
    posts : [SocialMediaPost];
    metrics : [SocialMediaMetrics];
    webhookLogs : [WebhookLog];
  };

  public query ({ caller }) func exportData() : async ExportPayload {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can export data");
    };
    {
      posts = posts.values().toArray();
      metrics = metrics.values().toArray();
      webhookLogs = webhookLogs.values().toArray();
    };
  };
};
