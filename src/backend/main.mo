import Map "mo:core/Map";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Float "mo:core/Float";
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

  // --- Lead Management (Added State & Methods) ---

  type LeadStatus = {
    #open;
    #in_progress;
    #won;
    #lost;
  };

  type Lead = {
    id : Nat;
    name : Text;
    email : Text;
    phone : Text;
    status : LeadStatus;
    createdAt : Int;
    updatedAt : Int;
    notes : Text;
  };

  var leads = Map.empty<Nat, Lead>();
  var nextLeadId = 1;

  public shared ({ caller }) func createLead(name : Text, email : Text, phone : Text, status : LeadStatus, notes : Text) : async Lead {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create leads");
    };

    let currentTime = Time.now();

    let newLead : Lead = {
      id = nextLeadId;
      name;
      email;
      phone;
      status;
      createdAt = currentTime;
      updatedAt = currentTime;
      notes;
    };
    leads.add(nextLeadId, newLead);
    nextLeadId += 1;
    newLead;
  };

  public shared ({ caller }) func importLeads(importedLeads : [Lead]) : async [Nat] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can import leads");
    };

    let idArray = importedLeads.map(
      func(importedLead) {
        let id = nextLeadId;

        let newLead : Lead = {
          id;
          name = importedLead.name;
          email = importedLead.email;
          phone = importedLead.phone;
          status = importedLead.status;
          createdAt = Time.now();
          updatedAt = Time.now();
          notes = importedLead.notes;
        };

        leads.add(id, newLead);
        nextLeadId += 1;
        id;
      }
    );
    idArray;
  };

  public query ({ caller }) func getLead(id : Nat) : async ?Lead {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view leads");
    };
    leads.get(id);
  };

  public query ({ caller }) func getAllLeads() : async [Lead] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view leads");
    };
    leads.values().toArray();
  };

  public query ({ caller }) func getAllLeadsPagination(page : Nat, pageSize : Nat) : async [Lead] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view leads");
    };
    if (pageSize == 0) { Runtime.trap("Page size cannot be 0") };

    let startIndex = page * pageSize;
    let allLeads = leads.values().toArray();
    let totalLeads = allLeads.size();

    if (startIndex >= totalLeads) {
      return [];
    };

    let remainingLeads = totalLeads - startIndex;
    let count = if (remainingLeads < pageSize) { remainingLeads } else {
      pageSize;
    };

    // Copy the paginated entries into a new array
    let resultArray : [?Lead] = Array.tabulate(
      count,
      func(i) {
        if (count == 0) { return null };
        let index = startIndex + i;
        if (index < totalLeads) {
          ?allLeads[index];
        } else {
          null;
        };
      },
    );

    // Filter out any null entries (e.g., from empty pages)
    let filtered : [Lead] = Array.tabulate<Lead>(
      count,
      func(i) {
        switch (resultArray[i]) {
          case (?lead) { lead };
          case (null) { unwrapLeadArray(allLeads)[0] };
        };
      },
    );

    filtered;
  };

  func unwrapLeadArray(array : [Lead]) : [Lead] {
    // Helper for returning at least one dummy element
    if (array.size() == 0) { [{ id = 0; name = "Empty"; email = ""; phone = ""; status = #open; createdAt = 0; updatedAt = 0; notes = "" }] } else {
      array;
    };
  };

  public shared ({ caller }) func updateLead(id : Nat, name : Text, email : Text, phone : Text, status : LeadStatus, notes : Text) : async Lead {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update leads");
    };
    switch (leads.get(id)) {
      case (null) { Runtime.trap("Lead not found") };
      case (?existingLead) {
        let updatedLead : Lead = {
          id;
          name;
          email;
          phone;
          status;
          createdAt = existingLead.createdAt;
          updatedAt = Time.now();
          notes;
        };
        leads.add(id, updatedLead);
        updatedLead;
      };
    };
  };

  public shared ({ caller }) func deleteLead(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete leads");
    };
    if (not leads.containsKey(id)) { Runtime.trap("Lead not found") };
    leads.remove(id);
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

  // Service State with Visibility
  type ServiceState = {
    isVisible : Bool;
  };

  let services = Map.empty<Text, ServiceState>();

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
    leads : [Lead];
    posts : [SocialMediaPost];
    metrics : [SocialMediaMetrics];
    webhookLogs : [WebhookLog];
  };

  public query ({ caller }) func exportData() : async ExportPayload {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can export data");
    };
    {
      leads = leads.values().toArray();
      posts = posts.values().toArray();
      metrics = metrics.values().toArray();
      webhookLogs = webhookLogs.values().toArray();
    };
  };

  // --- Digital Marketing (New State) ---

  // --- SEO Manager ---

  // Extension point for SEO fields (to match frontend)
  type SEOEntry = {
    id : Nat;
    pageUrl : Text;
    targetKeywords : [Text];
    metaTitle : Text;
    metaDescription : Text;
    createdAt : Int;
    updatedAt : Int;
  };

  // Extended State
  // Must not be persisted in mutable var, otherwise modification would not be detected for runtime migration
  let seoEntries = Map.empty<Nat, SEOEntry>();
  var nextSEOEntryId = 1;

  public shared ({ caller }) func createSEOEntry(pageUrl : Text, targetKeywords : [Text], metaTitle : Text, metaDescription : Text) : async SEOEntry {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create SEO entries");
    };

    let currentTime = timestampToNat(Time.now());

    let newSEOEntry : SEOEntry = {
      id = nextSEOEntryId;
      pageUrl;
      targetKeywords;
      metaTitle;
      metaDescription;
      createdAt = currentTime;
      updatedAt = currentTime;
    };
    seoEntries.add(nextSEOEntryId, newSEOEntry);
    nextSEOEntryId += 1;
    newSEOEntry;
  };

  public query ({ caller }) func getSEOEntry(id : Nat) : async ?SEOEntry {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view SEO entries");
    };
    seoEntries.get(id);
  };

  public query ({ caller }) func getAllSEOEntries() : async [SEOEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view SEO entries");
    };
    seoEntries.values().toArray();
  };

  public shared ({ caller }) func updateSEOEntry(id : Nat, pageUrl : Text, targetKeywords : [Text], metaTitle : Text, metaDescription : Text) : async SEOEntry {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update SEO entries");
    };
    switch (seoEntries.get(id)) {
      case (null) { Runtime.trap("SEO entry not found") };
      case (?existingEntry) {
        let updatedEntry : SEOEntry = {
          id;
          pageUrl;
          targetKeywords;
          metaTitle;
          metaDescription;
          createdAt = existingEntry.createdAt;
          updatedAt = timestampToNat(Time.now());
        };
        seoEntries.add(id, updatedEntry);
        updatedEntry;
      };
    };
  };

  public shared ({ caller }) func deleteSEOEntry(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete SEO entries");
    };
    if (not seoEntries.containsKey(id)) { Runtime.trap("SEO entry not found") };
    seoEntries.remove(id);
  };

  // --- Email Campaign Manager ---

  type EmailCampaign = {
    id : Nat;
    campaignName : Text;
    subjectLine : Text;
    bodyContent : Text;
    targetAudience : Text;
    status : {
      #draft;
      #active;
      #sent;
    };
    createdAt : Int;
    updatedAt : Int;
  };

  let emailCampaigns = Map.empty<Nat, EmailCampaign>();
  var nextEmailCampaignId = 1;

  public shared ({ caller }) func createEmailCampaign(campaignName : Text, subjectLine : Text, bodyContent : Text, targetAudience : Text, status : { #draft; #active; #sent }) : async EmailCampaign {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create email campaigns");
    };

    let currentTime = timestampToNat(Time.now());

    let newCampaign : EmailCampaign = {
      id = nextEmailCampaignId;
      campaignName;
      subjectLine;
      bodyContent;
      targetAudience;
      status;
      createdAt = currentTime;
      updatedAt = currentTime;
    };
    emailCampaigns.add(nextEmailCampaignId, newCampaign);
    nextEmailCampaignId += 1;
    newCampaign;
  };

  public query ({ caller }) func getEmailCampaign(id : Nat) : async ?EmailCampaign {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view email campaigns");
    };
    emailCampaigns.get(id);
  };

  public query ({ caller }) func getAllEmailCampaigns() : async [EmailCampaign] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view email campaigns");
    };
    emailCampaigns.values().toArray();
  };

  public shared ({ caller }) func updateEmailCampaign(id : Nat, campaignName : Text, subjectLine : Text, bodyContent : Text, targetAudience : Text, status : { #draft; #active; #sent }) : async EmailCampaign {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update email campaigns");
    };
    switch (emailCampaigns.get(id)) {
      case (null) { Runtime.trap("Email campaign not found") };
      case (?existingCampaign) {
        let updatedCampaign : EmailCampaign = {
          id;
          campaignName;
          subjectLine;
          bodyContent;
          targetAudience;
          status;
          createdAt = existingCampaign.createdAt;
          updatedAt = timestampToNat(Time.now());
        };
        emailCampaigns.add(id, updatedCampaign);
        updatedCampaign;
      };
    };
  };

  public shared ({ caller }) func deleteEmailCampaign(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete email campaigns");
    };
    if (not emailCampaigns.containsKey(id)) { Runtime.trap("Email campaign not found") };
    emailCampaigns.remove(id);
  };

  // --- Paid Ads Tracker ---

  type AdPlatform = {
    #googleAds;
    #meta;
    #linkedin;
    #youtube;
  };

  type AdCampaign = {
    id : Nat;
    campaignName : Text;
    platform : AdPlatform;
    budget : Float;
    spend : Float;
    impressions : Nat;
    clicks : Nat;
    conversions : Nat;
    createdAt : Int;
    updatedAt : Int;
  };

  let adCampaigns = Map.empty<Nat, AdCampaign>();
  var nextAdCampaignId = 1;

  public shared ({ caller }) func createAdCampaign(campaignName : Text, platform : AdPlatform, budget : Float, spend : Float, impressions : Nat, clicks : Nat, conversions : Nat) : async AdCampaign {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create ad campaigns");
    };

    let currentTime = timestampToNat(Time.now());

    let newCampaign : AdCampaign = {
      id = nextAdCampaignId;
      campaignName;
      platform;
      budget;
      spend;
      impressions;
      clicks;
      conversions;
      createdAt = currentTime;
      updatedAt = currentTime;
    };
    adCampaigns.add(nextAdCampaignId, newCampaign);
    nextAdCampaignId += 1;
    newCampaign;
  };

  public query ({ caller }) func getAdCampaign(id : Nat) : async ?AdCampaign {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view ad campaigns");
    };
    adCampaigns.get(id);
  };

  public query ({ caller }) func getAllAdCampaigns() : async [AdCampaign] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view ad campaigns");
    };
    adCampaigns.values().toArray();
  };

  public shared ({ caller }) func updateAdCampaign(id : Nat, campaignName : Text, platform : AdPlatform, budget : Float, spend : Float, impressions : Nat, clicks : Nat, conversions : Nat) : async AdCampaign {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update ad campaigns");
    };
    switch (adCampaigns.get(id)) {
      case (null) { Runtime.trap("Ad campaign not found") };
      case (?existingCampaign) {
        let updatedCampaign : AdCampaign = {
          id;
          campaignName;
          platform;
          budget;
          spend;
          impressions;
          clicks;
          conversions;
          createdAt = existingCampaign.createdAt;
          updatedAt = timestampToNat(Time.now());
        };
        adCampaigns.add(id, updatedCampaign);
        updatedCampaign;
      };
    };
  };

  public shared ({ caller }) func deleteAdCampaign(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete ad campaigns");
    };
    if (not adCampaigns.containsKey(id)) { Runtime.trap("Ad campaign not found") };
    adCampaigns.remove(id);
  };

  // --- Landing Page Builder Tracker ---

  type LandingPageStatus = {
    #active;
    #paused;
    #draft;
  };

  type LandingPage = {
    id : Nat;
    name : Text;
    url : Text;
    associatedCampaign : Text;
    conversionGoal : Text;
    status : LandingPageStatus;
    createdAt : Int;
    updatedAt : Int;
  };

  let landingPages = Map.empty<Nat, LandingPage>();
  var nextLandingPageId = 1;

  public shared ({ caller }) func createLandingPage(name : Text, url : Text, associatedCampaign : Text, conversionGoal : Text, status : LandingPageStatus) : async LandingPage {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create landing pages");
    };

    let currentTime = timestampToNat(Time.now());

    let newLandingPage : LandingPage = {
      id = nextLandingPageId;
      name;
      url;
      associatedCampaign;
      conversionGoal;
      status;
      createdAt = currentTime;
      updatedAt = currentTime;
    };
    landingPages.add(nextLandingPageId, newLandingPage);
    nextLandingPageId += 1;
    newLandingPage;
  };

  public query ({ caller }) func getLandingPage(id : Nat) : async ?LandingPage {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view landing pages");
    };
    landingPages.get(id);
  };

  public query ({ caller }) func getAllLandingPages() : async [LandingPage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view landing pages");
    };
    landingPages.values().toArray();
  };

  public shared ({ caller }) func updateLandingPage(id : Nat, name : Text, url : Text, associatedCampaign : Text, conversionGoal : Text, status : LandingPageStatus) : async LandingPage {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update landing pages");
    };
    switch (landingPages.get(id)) {
      case (null) { Runtime.trap("Landing page not found") };
      case (?existingPage) {
        let updatedPage : LandingPage = {
          id;
          name;
          url;
          associatedCampaign;
          conversionGoal;
          status;
          createdAt = existingPage.createdAt;
          updatedAt = timestampToNat(Time.now());
        };
        landingPages.add(id, updatedPage);
        updatedPage;
      };
    };
  };

  public shared ({ caller }) func deleteLandingPage(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete landing pages");
    };
    if (not landingPages.containsKey(id)) { Runtime.trap("Landing page not found") };
    landingPages.remove(id);
  };

  // Service Visibility Control

  public shared ({ caller }) func setServiceVisibility(serviceName : Text, isVisible : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can change service visibility");
    };

    switch (services.get(serviceName)) {
      case (null) {
        Runtime.trap("Service not found");
      };
      case (_) {
        services.add(serviceName, { isVisible });
      };
    };
  };

  // Open to all callers including guests: clients need to check visibility per service
  public query ({ caller }) func isServiceVisible(serviceName : Text) : async Bool {
    switch (services.get(serviceName)) {
      case (null) { false };
      case (?serviceState) { serviceState.isVisible };
    };
  };

  // Admin-only: returns the full administrative overview of all services and their visibility states
  public query ({ caller }) func getAllServicesWithVisibility() : async [(Text, Bool)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all service visibility states");
    };
    services.toArray().map<(Text, ServiceState), (Text, Bool)>(
      func((name, state)) { (name, state.isVisible) }
    );
  };

  // ----------- BEGIN PUBLIC LEADS/SERVICES SYSTEM -----------

  // New public enums and types
  type PublicLeadStatus = {
    #new;
    #contacted;
    #qualified;
    #proposal_sent;
    #closed_won;
  };

  type PublicLead = {
    id : Nat;
    name : Text;
    email : Text;
    phone : Text;
    status : PublicLeadStatus;
    notes : Text;
    createdAt : Int;
    updatedAt : Int;
  };

  type PublicPackage = {
    name : Text;
    price : Nat;
    features : [Text];
  };

  type PublicAddon = {
    name : Text;
    price : Nat;
  };

  type PublicService = {
    id : Text;
    title : Text;
    category : Text;
    description : Text;
    packages : [PublicPackage];
    addons : [PublicAddon];
    imageUrl : Text;
    isVisible : Bool;
    sortOrder : Nat;
  };

  var publicLeads = Map.empty<Nat, PublicLead>();
  var nextPublicLeadId = 1;
  var publicServices = Map.empty<Text, PublicService>();

  // Public Leads CRUD (open to all, no auth checks)

  public shared ({ caller }) func publicCreateLead(name : Text, email : Text, phone : Text, status : PublicLeadStatus, notes : Text) : async PublicLead {
    let currentTime = Time.now();

    let newLead : PublicLead = {
      id = nextPublicLeadId;
      name;
      email;
      phone;
      status;
      notes;
      createdAt = currentTime;
      updatedAt = currentTime;
    };
    publicLeads.add(nextPublicLeadId, newLead);
    nextPublicLeadId += 1;
    newLead;
  };

  public query ({ caller }) func publicGetAllLeads() : async [PublicLead] {
    publicLeads.values().toArray();
  };

  public shared ({ caller }) func publicUpdateLead(id : Nat, name : Text, email : Text, phone : Text, status : PublicLeadStatus, notes : Text) : async PublicLead {
    switch (publicLeads.get(id)) {
      case (null) { Runtime.trap("Public Lead not found") };
      case (?existingLead) {
        let updatedLead : PublicLead = {
          id;
          name;
          email;
          phone;
          status;
          notes;
          createdAt = existingLead.createdAt;
          updatedAt = Time.now();
        };
        publicLeads.add(id, updatedLead);
        updatedLead;
      };
    };
  };

  public shared ({ caller }) func publicDeleteLead(id : Nat) : async () {
    if (not publicLeads.containsKey(id)) { Runtime.trap("Public Lead not found") };
    publicLeads.remove(id);
  };

  public shared ({ caller }) func publicImportLeads(items : [{ name : Text; email : Text; phone : Text; status : PublicLeadStatus; notes : Text }]) : async [Nat] {
    let idArray = items.map(
      func(item) {
        let id = nextPublicLeadId;

        let newLead : PublicLead = {
          id;
          name = item.name;
          email = item.email;
          phone = item.phone;
          status = item.status;
          notes = item.notes;
          createdAt = Time.now();
          updatedAt = Time.now();
        };

        publicLeads.add(id, newLead);
        nextPublicLeadId += 1;
        id;
      }
    );
    idArray;
  };

  // Public Services CRUD (open to all, no auth checks)

  public shared ({ caller }) func publicCreateService(id : Text, title : Text, category : Text, description : Text, packages : [PublicPackage], addons : [PublicAddon], imageUrl : Text, isVisible : Bool, sortOrder : Nat) : async PublicService {
    let newService : PublicService = {
      id;
      title;
      category;
      description;
      packages;
      addons;
      imageUrl;
      isVisible;
      sortOrder;
    };
    publicServices.add(id, newService);
    newService;
  };

  public query ({ caller }) func publicGetAllServices() : async [PublicService] {
    publicServices.values().toArray();
  };

  public shared ({ caller }) func publicUpdateService(id : Text, title : Text, category : Text, description : Text, packages : [PublicPackage], addons : [PublicAddon], imageUrl : Text, isVisible : Bool, sortOrder : Nat) : async PublicService {
    switch (publicServices.get(id)) {
      case (null) { Runtime.trap("Public Service not found") };
      case (?existingService) {
        let updatedService : PublicService = {
          id;
          title;
          category;
          description;
          packages;
          addons;
          imageUrl;
          isVisible;
          sortOrder;
        };
        publicServices.add(id, updatedService);
        updatedService;
      };
    };
  };

  public shared ({ caller }) func publicDeleteService(id : Text) : async () {
    if (not publicServices.containsKey(id)) { Runtime.trap("Public Service not found") };
    publicServices.remove(id);
  };

  public shared ({ caller }) func publicSetServiceVisibility(id : Text, isVisible : Bool) : async () {
    switch (publicServices.get(id)) {
      case (null) { Runtime.trap("Public Service not found") };
      case (?existingService) {
        let updatedService : PublicService = {
          id = existingService.id;
          title = existingService.title;
          category = existingService.category;
          description = existingService.description;
          packages = existingService.packages;
          addons = existingService.addons;
          imageUrl = existingService.imageUrl;
          isVisible;
          sortOrder = existingService.sortOrder;
        };
        publicServices.add(id, updatedService);
      };
    };
  };

  public shared ({ caller }) func publicSeedServices(items : [PublicService]) : async Nat {
    for (service in items.values()) {
      publicServices.add(service.id, service);
    };
    items.size();
  };
};
