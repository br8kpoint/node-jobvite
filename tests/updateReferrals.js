var Jobvite = require('../lib/jobvite').Jobvite;
//var Referral = require('/home/mike/Work/callcenter_express/app/models/referral.js')
var mongodb = require('mongodb').MongoClient
var moment = require('moment')
var async = require('async')
var Referral;
var Jobvite = require('../lib/jobvite').Jobvite
var credentials = {
	api_key : 'biblesforisrael_api_key'						//set to your Jobvite API key
	, secret_key : 'd199cf3a57800ffd8a7710f5490036c8'		//set to your Jobvite SECRET key	
} 
exports.Jobvite = function(callback){
	mongodb.connect('mongodb://localhost/referral', function(err, db) {
    	if(err){
    		console.log(err)
    		return
    	}
    	Referral = db.collection('contacts')
    });
	var jobvite = new Jobvite({credentials: credentials, url: 'https://api-stg.jobvite.com/v1'})
	console.log("Getting candidates")
	console.time("process")
	console.time("Getting-candidates");
	jobvite.getCandidates({}, function(err, result){
		if(err) return callback(err);
		var count = 0;
		var newPeople = [];
		console.timeEnd("Getting-candidates")
		console.warn("Retrieved ", result.length, " candidates")
		var tm = result.filter(function(item){
			return item.posting && item.posting.requisitionId == "TM02"
		})
		console.warn("Updating", tm.length, " candidates")
		async.forEach(tm, function(item, cb){
			item.last_updated = new Date();
			console.log("Updating", "Email:", item.profile.contact_methods.email, "Name: ", item.profile.name.first + " " + item.profile.name.last)
			var doc;
			try{
				doc = {
					$set: { Status: person.record_info.status},
					$set: { Jobvite: item}
				}
			}catch(e){
				doc = {
					$set: {Jobvite: item}
				}
			}
			Referral.findAndModify(
				{$or: [
					{Email: item.profile.contact_methods.email}
					, {$and: [ {FirstName: item.profile.name.first}, {LastName: item.profile.name.last} ]}
				]},
				[['_id','asc']],
				doc, 
				{}, 
				function(err, updated){
					if(!err){
						if(updated) {
							console.log("Updated: ", updated.FirstName, updated.LastName);
							count = count + 1;
						}
						else{
							newPeople.push(item);
						}
					} 
					else console.warn("Error updating:", err.message)
					cb(err);
				}
			)
		}, function(err){
			if(err){
				return callback(err)
			}
			console.warn("Updated:", count , " records")
			var inserts = []
			newPeople.forEach(function(person){
				var doc = {}
				try{doc.FirstName = person.profile.name.first;}catch(e){}
				try{doc.LastName = person.profile.name.last;}catch(e){}
				try{doc.Country = person.profile.contact_methods.address.country;}catch(e){}
				try{doc.PostalCode = person.profile.contact_methods.address.postal_code;}catch(e){}
				try{doc.State = person.profile.contact_methods.address.region;}catch(e){}
				try{doc.City = person.profile.contact_methods.address.city;}catch(e){}
				try{doc.Street = person.profile.contact_methods.address.address_lines[0] || " "  + person.profile.contact_methods.postal_address.address_lines[1] || ""}catch(e){}
				try{doc.Email = person.profile.contact_methods.email;}catch(e){}
				try{doc.HomePhone = person.profile.contact_methods.phone;}catch(e){}
				try{doc.MobilePhone = person.profile.contact_methods.mobile;}catch(e){}
				try{doc.FaxPhone = person.profile.contact_methods.fax;}catch(e){}
				try{doc.Job = person.posting.title;}catch(e){}
				try{doc.Status = person.record_info.status}catch(e){}
				doc.Deleted = false;
				doc.New = true;
				doc.Viewed = false;
				doc.Jobvite = person;
				person.last_updated = new Date();
				doc.ImportSource = "Jobvite";
				doc.Date = new Date();
				inserts.push(doc);
			})
			console.warn("Attempting to insert ", inserts.length, " people")
			console.log(inserts)
			Referral.insert(inserts, {safe:true}, function(err, results){
				if(err){
					console.warn(err.message);
					return callback(err, results)
				} 
				console.warn("Inserted ", results.length + " people")
				callback(err, results)
			})
		})
		
	})
}
exports.Jobvite(function(err, result){
	process.exit();
})