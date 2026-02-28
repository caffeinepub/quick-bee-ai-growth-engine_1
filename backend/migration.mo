import Map "mo:core/Map";
import Text "mo:core/Text";
import Int "mo:core/Int";

module {
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

  // Old Actor types (from previous version)
  type Package = {
    tier : Text;
    priceINR : Nat;
    features : [Text];
  };

  type Addon = {
    name : Text;
    price : Nat;
  };

  type Service = {
    id : Nat;
    name : Text;
    category : Text;
    description : Text;
    packages : [Package];
    addons : [Addon];
    maintenancePlan : Nat;
    isVisible : Bool;
    sortOrder : Int;
  };

  type Lead = {
    id : Nat;
    name : Text;
    email : Text;
    phone : Text;
    serviceInterest : Text;
    status : Text;
    notes : Text;
  };

  type OldActor = {
    nextLeadId : Nat;
    nextServiceId : Nat;
    services : Map.Map<Nat, Service>;
    leads : Map.Map<Nat, Lead>;
  };

  type NewActor = {
    nextPostId : Nat;
    nextMetricsId : Nat;
    nextWebhookId : Nat;
    posts : Map.Map<Nat, SocialMediaPost>;
    metrics : Map.Map<Nat, SocialMediaMetrics>;
    webhookLogs : Map.Map<Nat, WebhookLog>;
  };

  // State migration function
  public func run(_old : OldActor) : NewActor {
    {
      nextPostId = 1;
      nextMetricsId = 1;
      nextWebhookId = 1;
      posts = Map.empty<Nat, SocialMediaPost>();
      metrics = Map.empty<Nat, SocialMediaMetrics>();
      webhookLogs = Map.empty<Nat, WebhookLog>();
    };
  };
};
