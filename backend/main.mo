import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  // Lead Management Types
  type Lead = {
    id : Nat;
    name : Text;
    email : Text;
    phone : Text;
    serviceInterest : Text;
    status : Text; // New, Contacted, Qualified, Proposal Sent, Closed Won, Closed Lost
    notes : Text;
  };

  var nextLeadId = 1;
  let leads = Map.empty<Nat, Lead>();

  // Service Management Types
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
    category : Text; // Web Dev, App Dev, AI Automation, etc.
    description : Text;
    packages : [Package];
    addons : [Addon];
    maintenancePlan : Nat;
    isVisible : Bool;
    sortOrder : Int;
  };

  var nextServiceId = 1;
  let services = Map.empty<Nat, Service>();

  module Service {
    public func compareBySortOrder(a : Service, b : Service) : Order.Order {
      Int.compare(a.sortOrder, b.sortOrder);
    };
  };

  // Lead Management Functions
  public shared ({ caller }) func createLead(name : Text, email : Text, phone : Text, serviceInterest : Text, status : Text, notes : Text) : async Lead {
    let newLead : Lead = {
      id = nextLeadId;
      name;
      email;
      phone;
      serviceInterest;
      status;
      notes;
    };
    leads.add(nextLeadId, newLead);
    nextLeadId += 1;
    newLead;
  };

  public query ({ caller }) func getLeads() : async [Lead] {
    leads.values().toArray();
  };

  public shared ({ caller }) func updateLead(id : Nat, name : Text, email : Text, phone : Text, serviceInterest : Text, status : Text, notes : Text) : async Lead {
    switch (leads.get(id)) {
      case (null) { Runtime.trap("Lead not found") };
      case (?_) {
        let updatedLead : Lead = {
          id;
          name;
          email;
          phone;
          serviceInterest;
          status;
          notes;
        };
        leads.add(id, updatedLead);
        updatedLead;
      };
    };
  };

  public shared ({ caller }) func deleteLead(id : Nat) : async () {
    if (not leads.containsKey(id)) { Runtime.trap("Lead not found") };
    leads.remove(id);
  };

  // Service Management Functions
  public shared ({ caller }) func createService(name : Text, category : Text, description : Text, packages : [Package], addons : [Addon], maintenancePlan : Nat, isVisible : Bool, sortOrder : Int) : async Service {
    let newService : Service = {
      id = nextServiceId;
      name;
      category;
      description;
      packages;
      addons;
      maintenancePlan;
      isVisible;
      sortOrder;
    };
    services.add(nextServiceId, newService);
    nextServiceId += 1;
    newService;
  };

  public query ({ caller }) func getServices() : async [Service] {
    services.values().toArray().sort(Service.compareBySortOrder);
  };

  public shared ({ caller }) func updateService(id : Nat, name : Text, category : Text, description : Text, packages : [Package], addons : [Addon], maintenancePlan : Nat, isVisible : Bool, sortOrder : Int) : async Service {
    switch (services.get(id)) {
      case (null) { Runtime.trap("Service not found") };
      case (?_) {
        let updatedService : Service = {
          id;
          name;
          category;
          description;
          packages;
          addons;
          maintenancePlan;
          isVisible;
          sortOrder;
        };
        services.add(id, updatedService);
        updatedService;
      };
    };
  };

  public shared ({ caller }) func deleteService(id : Nat) : async () {
    if (not services.containsKey(id)) { Runtime.trap("Service not found") };
    services.remove(id);
  };

  public shared ({ caller }) func reorderServices(serviceIds : [Nat]) : async () {
    var order = 0;
    for (id in serviceIds.values()) {
      switch (services.get(id)) {
        case (null) {};
        case (?service) {
          let updatedService : Service = {
            id = service.id;
            name = service.name;
            category = service.category;
            description = service.description;
            packages = service.packages;
            addons = service.addons;
            maintenancePlan = service.maintenancePlan;
            isVisible = service.isVisible;
            sortOrder = order;
          };
          services.add(id, updatedService);
        };
      };
      order += 1;
    };
  };

  public shared ({ caller }) func duplicateService(id : Nat) : async Service {
    switch (services.get(id)) {
      case (null) { Runtime.trap("Service not found") };
      case (?service) {
        let newService : Service = {
          id = nextServiceId;
          name = service.name.concat(" (Copy)");
          category = service.category;
          description = service.description;
          packages = service.packages;
          addons = service.addons;
          maintenancePlan = service.maintenancePlan;
          isVisible = false;
          sortOrder = service.sortOrder + 1;
        };
        services.add(nextServiceId, newService);
        nextServiceId += 1;
        newService;
      };
    };
  };
};
