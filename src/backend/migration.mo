import Map "mo:core/Map";
import Nat "mo:core/Nat";

module {
  type OldActor = { leads : Map.Map<Nat, { id : Nat; name : Text; email : Text; phone : Text; status : { #open; #in_progress; #won; #lost }; createdAt : Int; updatedAt : Int; notes : Text }>; nextLeadId : Nat };
  type NewActor = { leads : Map.Map<Nat, { id : Nat; name : Text; email : Text; phone : Text; status : { #open; #in_progress; #won; #lost }; createdAt : Int; updatedAt : Int; notes : Text }>; nextLeadId : Nat; publicLeads : Map.Map<Nat, { id : Nat; name : Text; email : Text; phone : Text; status : { #new; #contacted; #qualified; #proposal_sent; #closed_won }; notes : Text; createdAt : Int; updatedAt : Int }>; nextPublicLeadId : Nat; publicServices : Map.Map<Text, { id : Text; title : Text; category : Text; description : Text; packages : [{ name : Text; price : Nat; features : [Text] }]; addons : [{ name : Text; price : Nat }]; imageUrl : Text; isVisible : Bool; sortOrder : Nat }> };

  public func run(old : OldActor) : NewActor {
    { old with publicLeads = Map.empty<Nat, { id : Nat; name : Text; email : Text; phone : Text; status : { #new; #contacted; #qualified; #proposal_sent; #closed_won }; notes : Text; createdAt : Int; updatedAt : Int }>(); nextPublicLeadId = 1; publicServices = Map.empty<Text, { id : Text; title : Text; category : Text; description : Text; packages : [{ name : Text; price : Nat; features : [Text] }]; addons : [{ name : Text; price : Nat }]; imageUrl : Text; isVisible : Bool; sortOrder : Nat }>() };
  };
};
