var swiz = require('swiz')
var O = swiz.struct.Obj
var F = swiz.struct.Field
var xtend = require('xtend')
var request = require('request')
var xml2js = require('xml2js')
var inspect = require('eyes').inspector({maxLength: false})
/**
 * Credentials for api access. You must set this when using the library for proper function.
 * @type {
 *       api_key 		The api key issued by jobvite
 *       secret_key		The api secret key issued by jobvite
 * }
 */
var credentials = {
	api_key: null
	, secret_key: null
}


function Jobvite(options){
	var self = this;
	var defaults = {
		url: 'https://api.jobvite.com/v1'
	}
	self.opts = xtend({}, defaults, options)
}

Jobvite.prototype.getCandidates = function(params, cb){
	//console.log("opts:", this.opts)
	var self = this;
	params.api = self.opts.credentials.api_key;
	params.secret = self.opts.credentials.secret_key;
	params.format = 'hrxml'
	request({
		url: self.opts.url + '/candidate'
		, qs: params
	}, function(error, response, body){
		/*console.log("error:", error)
		console.log("response:", response)
		console.log("body:", body)
        */
       console.log(body)
		self.deserializeCandidates(body, cb)
	})
}

Jobvite.prototype.deserializeCandidates = function(data, cb){
	//console.log(data);
	var parser = new xml2js.Parser();
    parser.parseString(data, function (err, result) {
        //console.dir(result);
        console.log('Done');
        var candidates = mapCandidates(result.Results.Candidates)
        cb(err, candidates)
    });
/*
	var sw = new swiz.Swiz(defs, {stripNulls: true});
  	var obj = sw.deserializeXml(data);
  	console.log('Deserialized:');
	console.log(obj);
	cb(err, obj);
*/
}

/**
 * Map xml2Json ouptut to a more sensible Candidate Object
 * @param  {[type]} xmljson [description]
 * @return {[type]}         [description]
 *
 * Sample xml2json array
 *
 *  {
                ns:CandidateProfile: [
                    {
                        ns:PersonalData: [
                            {
                                ns:PersonId: [
                                    {
                                        ns:IdValue: [
                                            {
                                                $: { name: 'candidateId' },
                                                _: 'S123'
                                            }
                                        ],
                                        $: { idOwner: 'Jobvite' }
                                    }
                                ],
                                ns:ContactMethod: [
                                    {
                                        ns:Fax: [
                                            {
                                                ns:FormattedNumber: [ '415-555-1212' ]
                                            }
                                        ],
                                        ns:Use: [ 'personal' ],
                                        ns:Telephone: [
                                            {
                                                ns:FormattedNumber: [ '650-555-1212' ]
                                            }
                                        ],
                                        ns:InternetEmailAddress: [ 'johndoe@candidate1.com' ],
                                        ns:Mobile: [
                                            {
                                                ns:FormattedNumber: [ '650-555-1212' ]
                                            }
                                        ],
                                        ns:Location: [ 'home' ],
                                        ns:PostalAddress: [
                                            {
                                                ns:CountryCode: [ 'US' ],
                                                ns:Municipality: [ 'San Francisco' ],
                                                ns:PostalCode: [ '94118' ],
                                                ns:Region: [ 'CA' ],
                                                ns:DeliveryAddress: [
                                                    {
                                                        ns:AddressLine: [ '123 Main St.', '2nd Floor' ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                ns:PersonName: [
                                    {
                                        ns:GivenName: [ 'John' ],
                                        ns:FamilyName: [ 'Doe' ]
                                    }
                                ]
                            }
                        ]
                    }
                ],
                ns:Resume: [
                    {
                        ns:NonXMLResume: [
                            {
                                ns:TextResume: [ '\n\011\011\011\011\011\011John Doe\n\011\011\011\011\011\011johndoe@candidate1.com\n\011\011\011\011\011\011415-555-1212\n\011\011\011\011\011\011This is a really extensive resume for a great candidate. Please hire me!\n\011\011\011\011\011' ]
                            }
                        ]
                    }
                ],
                ns:CandidateRecordInfo: [
                    {
                        ns:Status: [ 'New' ],
                        ns:Id: [
                            {
                                ns:IdValue: [
                                    {
                                        $: { name: 'applicationId' },
                                        _: '2123'
                                    }
                                ],
                                $: { idOwner: 'Jobvite' }
                            }
                        ]
                    }
                ],
                $: { xmlns:ns: 'http://ns.hr-xml.org/2007-04-15' },
                ns:CandidateSupplier: [
                    {
                        ns:SupplierId: [
                            {
                                ns:IdValue: [
                                    {
                                        $: { name: 'sourcedBy' },
                                        _: '50'
                                    }
                                ],
                                $: { idOwner: 'Jobvite' }
                            }
                        ],
                        ns:EntityName: [ 'Alex Recruiter' ],
                        ns:SourceType: [
                            {
                                ns:NonStandardValue: [ 'Agency' ]
                            }
                        ]
                    }
                ],
                ns:RelatedPositionPostings: [
                    {
                        ns:PositionPosting: [
                            {
                                ns:Id: [
                                    {
                                        ns:IdValue: [
                                            {
                                                $: { name: 'requisitionId' },
                                                _: '20081023'
                                            }
                                        ],
                                        $: { idOwner: 'Jobvite' }
                                    }
                                ],
                                ns:Title: [ 'Accountant' ]
                            }
                        ]
                    }
                ],
                ns:UserArea: [
                    {
                        CustomFields: [
                            {
                                $: { xmlns: 'http://api.jobvite.com/action/api/v1' },
                                Field: [
                                    {
                                        $: { name: 'Candidate Field 1', type: 'Candidate' },
                                        _: 'Some value'
                                    },
                                    {
                                        $: { name: 'Candidate Field 2', type: 'Candidate' },
                                        _: 'Some other value'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                ns:CandidateProfile: [
                    {
                        ns:PersonalData: [
                            {
                                ns:PersonId: [
                                    {
                                        ns:IdValue: [
                                            {
                                                $: { name: 'candidateId' },
                                                _: 'S234'
                                            }
                                        ],
                                        $: { idOwner: 'Jobvite' }
                                    }
                                ],
                                ns:ContactMethod: [
                                    {
                                        ns:Fax: [
                                            {
                                                ns:FormattedNumber: [ '415-555-1212' ]
                                            }
                                        ],
                                        ns:Use: [ 'personal' ],
                                        ns:Telephone: [
                                            {
                                                ns:FormattedNumber: [ '650-555-1212' ]
                                            }
                                        ],
                                        ns:InternetEmailAddress: [ 'jane@candidate1.com' ],
                                        ns:Mobile: [
                                            {
                                                ns:FormattedNumber: [ '650-555-1212' ]
                                            }
                                        ],
                                        ns:Location: [ 'home' ],
                                        ns:PostalAddress: [
                                            {
                                                ns:CountryCode: [ 'US' ],
                                                ns:Municipality: [ 'San Francisco' ],
                                                ns:PostalCode: [ '94118' ],
                                                ns:Region: [ 'CA' ],
                                                ns:DeliveryAddress: [
                                                    {
                                                        ns:AddressLine: [ '123 Main St.', '2nd Floor' ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                ns:PersonName: [
                                    {
                                        ns:GivenName: [ 'Jane' ],
                                        ns:FamilyName: [ 'Doe' ]
                                    }
                                ]
                            }
                        ]
                    }
                ],
                ns:Resume: [
                    {
                        ns:NonXMLResume: [
                            {
                                ns:TextResume: [ '\n\011\011\011\011\011\011Jane Doe\n\011\011\011\011\011\011jane@candidate1.com\n\011\011\011\011\011\011408-555-1212\n\011\011\011\011\011\011I am a great candidate!\n\011\011\011\011\011' ]
                            }
                        ]
                    }
                ],
                ns:CandidateRecordInfo: [
                    {
                        ns:Status: [ 'New' ],
                        ns:Id: [
                            {
                                ns:IdValue: [
                                    {
                                        $: { name: 'applicationId' },
                                        _: '2123'
                                    }
                                ],
                                $: { idOwner: 'Jobvite' }
                            }
                        ]
                    }
                ],
                $: { xmlns:ns: 'http://ns.hr-xml.org/2007-04-15' },
                ns:CandidateSupplier: [
                    {
                        ns:SupplierId: [
                            {
                                ns:IdValue: [
                                    {
                                        $: { name: 'sourcedBy' },
                                        _: '511'
                                    }
                                ],
                                $: { idOwner: 'Jobvite' }
                            }
                        ],
                        ns:EntityName: [ 'Alex Recruiter' ],
                        ns:SourceType: [
                            {
                                ns:NonStandardValue: [ 'Employee' ]
                            }
                        ]
                    }
                ],
                ns:RelatedPositionPostings: [
                    {
                        ns:PositionPosting: [
                            {
                                ns:Id: [
                                    {
                                        ns:IdValue: [
                                            {
                                                $: { name: 'requisitionId' },
                                                _: '20081023'
                                            }
                                        ],
                                        $: { idOwner: 'Jobvite' }
                                    }
                                ],
                                ns:Title: [ 'Accountant' ]
                            }
                        ]
                    }
                ],
                ns:UserArea: [
                    {
                        CustomFields: [
                            {
                                $: { xmlns: 'http://api.jobvite.com/action/api/v1' },
                                Field: [
                                    {
                                        $: { name: 'Candidate Field 3', type: 'Candidate' },
                                        _: 'Some value'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
]
 */
function mapCandidates(xmljson){
	var results = [];
	xmljson[0]['ns:Candidate'].forEach(function(item){
		var candidate = {};
        try{
            candidate.record_info = {
                appliationId: item['ns:CandidateRecordInfo'][0]['ns:Id'][0]['ns:IdValue'][0]._,
                status: item['ns:CandidateRecordInfo'][0]['ns:Status'][0]
            }
        }
		catch(ex){console.log("Error parsing record info:", item)}
        try{
            candidate.posting = {
                requisitionId: item['ns:RelatedPositionPostings'][0]['ns:PositionPosting'][0]['ns:Id'][0]['ns:IdValue'][0]._,
                title: item['ns:RelatedPositionPostings'][0]['ns:PositionPosting'][0]['ns:Title'][0]
            }
        }
        catch(ex){console.log("Error parsing posting:", item)}
		
		try{
			candidate.supplier = {
				sourcedBy: item['ns:CandidateSupplier'][0]['ns:SupplierId'][0]['ns:Id'][0]['ns:IdValue'][0]._,
				name: item['ns:CandidateSupplier'][0]['ns:EntityName'][0],
				type: item['ns:CandidateSupplier'][0]['ns:SourceType'][0]['ns:NonStandardValue'][0]
			}

		}
        catch(ex){console.log("Error parsing supplier:", item)}
		
		candidate.profile = {}
		try{
			candidate.profile.id = item['ns:CandidateProfile'][0]['ns:PersonalData'][0]['ns:PersonId'][0]['ns"IdValue']._
		} 
        catch(ex){console.log("Error parsing profile id:", item)}
		try{
			candidate.profile.name = {
				first: item['ns:CandidateProfile'][0]['ns:PersonalData'][0]['ns:PersonName'][0]['ns:GivenName'][0],
				last: item['ns:CandidateProfile'][0]['ns:PersonalData'][0]['ns:PersonName'][0]['ns:FamilyName'][0]
			}
		}
        catch(ex){console.log("Error parsing name:", item)}
		candidate.profile.contact_methods = {}
		try{
			candidate.profile.contact_methods.use = item['ns:CandidateProfile'][0]['ns:PersonalData'][0]['ns:ContactMethod'][0]['ns:Use'][0]
		}catch(ex){console.log("Error parsing use:", item)}
		try{
			candidate.profile.contact_methods.fax = item['ns:CandidateProfile'][0]['ns:PersonalData'][0]['ns:ContactMethod'][0]['ns:Fax'][0]['ns:FormattedNumber'][0]
		}catch(ex){console.log("Error parsing fax:", item)}
		try{
			candidate.profile.contact_methods.phone = item['ns:CandidateProfile'][0]['ns:PersonalData'][0]['ns:ContactMethod'][0]['ns:Telephone'][0]['ns:FormattedNumber'][0]
		}catch(ex){console.log("Error parsing phone:", item)}
		try{
			candidate.profile.contact_methods.mobile = item['ns:CandidateProfile'][0]['ns:PersonalData'][0]['ns:ContactMethod'][0]['ns:Mobile'][0]['ns:FormattedNumber'][0]
		}catch(ex){console.log("Error parsing mobile:", item)}
		try{
			candidate.profile.contact_methods.email = item['ns:CandidateProfile'][0]['ns:PersonalData'][0]['ns:ContactMethod'][0]['ns:InternetEmailAddress'][0]
		}catch(ex){console.log("Error parsing email:", item)}
		try{
			candidate.profile.contact_methods.location = item['ns:CandidateProfile'][0]['ns:PersonalData'][0]['ns:ContactMethod'][0]['ns:Location'][0]
		}catch(ex){console.log("Error parsing location:", item)}
		candidate.profile.contact_methods.address = {

		}
		try{
			candidate.profile.contact_methods.address.country = item['ns:CandidateProfile'][0]['ns:PersonalData'][0]['ns:ContactMethod'][0]['ns:PostalAddress'][0]['ns:CountryCode'][0]
		}catch(ex){console.log("Error parsing country:", item)}
		try{
			candidate.profile.contact_methods.address.city = item['ns:CandidateProfile'][0]['ns:PersonalData'][0]['ns:ContactMethod'][0]['ns:PostalAddress'][0]['ns:Municipality'][0]
		}catch(ex){console.log("Error parsing city:", item)}
		try{
			candidate.profile.contact_methods.address.postal_code = item['ns:CandidateProfile'][0]['ns:PersonalData'][0]['ns:ContactMethod'][0]['ns:PostalAddress'][0]['ns:PostalCode'][0]
		}catch(ex){console.log("Error parsing postal_code:", item)}
		try{
			candidate.profile.contact_methods.address.region = item['ns:CandidateProfile'][0]['ns:PersonalData'][0]['ns:ContactMethod'][0]['ns:PostalAddress'][0]['ns:Region'][0]
		}catch(ex){console.log("Error parsing address region:", item)}
		try{
			candidate.profile.contact_methods.address.address_lines = item['ns:CandidateProfile'][0]['ns:PersonalData'][0]['ns:ContactMethod'][0]['ns:PostalAddress'][0]['ns:DeliveryAddress'][0]['ns:AddressLine']
		}catch(ex){console.log("Error parsing address lines:", item)}
		try{
            //console.log(item['ns:Resume'][0]['ns:NonXMLResume'][0])
			candidate.resume = item['ns:Resume'][0]['ns:NonXMLResume'][0]['ns:TextResume'][0]
		}catch(ex){console.log("Error parsing resume:", item)}
		/*try{
			candidate.cover_letter = item['ns:UserArea'][0]['CustomFields'][0]['TextResume'][0]
		}catch(ex){}
		*/
        mapUserArea(item['ns:UserArea'][0], candidate)
		results.push(candidate)
	})
	return results;

}

function mapUserArea(xml, candidate){
    candidate.custom_fields = {}
    var custom_fields = candidate.custom_fields
    xml.CustomFields.forEach(function(field){
        try{
            custom_fields[field.Field[0].$.name] = field.Field[0]._
        }
        catch(ex){console.log("Error parsing custom fields:", xml)}
    })
}
exports.Jobvite = Jobvite