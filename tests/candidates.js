var assert = require ('assert')
	, Jobvite = require('../lib/jobvite').Jobvite
	, fs = require('fs')
var inspect = require('eyes').inspector({maxLength: false})

var credentials = {
	api_key : 'biblesforisrael_api_key'						//set to your Jobvite API key
	, secret_key : 'd199cf3a57800ffd8a7710f5490036c8'		//set to your Jobvite SECRET key	
} 


describe('Candidate', function(){
	var donor = undefined;
	describe('Deserialize', function(){
		it('should deserialize a list of xml candidates', function(done){
			fs.readFile('tests/testCandidates.xml', 'utf8', function(err, xml){
				var jobvite = new Jobvite({credentials: credentials, url: 'https://api-stg.jobvite.com/v1'})
				jobvite.deserializeCandidates(xml, function(err, candidates){
					assert.ok(candidates.length > 0)
					inspect(candidates)
					done()
				})
			})
		});
		it('should get a list of candidates from the api', function(done){
			var jobvite = new Jobvite({credentials: credentials, url: 'https://api-stg.jobvite.com/v1'})
			jobvite.getCandidates({datestart: '05-10-2013'}, function(err, candidates){
				assert.ok(candidates.length > 0)
				inspect(candidates)
				done()
			})
		})
	});
	
});

