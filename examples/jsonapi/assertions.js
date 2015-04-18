// Main entry point : document - a json document

require('should');

assertion("A JSON object **MUST** be at the root of every JSON API response containing data.", function(document){
    document.should.be.type('object').and.not.an.Array;
});

assertion("A document **MUST** contain either primary data or an array of [error objects](#errors).")
    .hasCase('Primary data **MUST** appear under a top-level key named `"data"`.', function(document) {
        document.data.should.be.ok;
        this.provides('primaryData', document.data);
    })
    .hasCase('Error objects **MUST** appear under a top-level key named `"errors"`.', function(document) {
        document.errors.should.be.ok;
        this.provides('errors', document.errors);
    });


assertion("Primary data **MUST** be either a single resource object, an array of resource objects, or a value representing a resource relationship.", function(primaryData){
    var self = this;    // TODO switch to es6 to use arrows and remove this madness
    if(Array.isArray(primaryData)) {
        primaryData.forEach(function (resourceObject) {
            self.provides('resourceObject', resourceObject);
        })
    } else {
        oneOf( // TODO : rethink how to support this
            this.provides('resourceObject', primaryData),
            this.provides('resourceRelationship', primaryData)
        )
    }
});

assertion("If any of these members appears in the top-level of a response, their values **MUST** comply with this specification.", function(document) {
    if(document.hasOwnProperty('meta'))
        this.provides('meta', document.meta);
    if(document.hasOwnProperty('links'))
        this.provides('links', document.links);
    if(document.hasOwnProperty('included'))
        this.provides('included', document.included);
});

assertion('A resource object **MUST** contain at least the following top-level members:\
\n\
\n* `"id"`\
\n* `"type"`\
\n\
\nException: The `id` member is not required when the resource object originates at\
\nthe client and represents a new resource to be created on the server.', function(resourceObject){
    resourceObject.should.have.property('type');
}, function(response, resourceObject){  // TODO I had forgotten about this use-case, add multiple body support
    resourceObject.should.have.property('id');
});

assertion('In addition, a resource object **MAY** contain any of these top-level members:\
\n\
\n* `"links"`: a "links object", providing information about a resource\'s relationships (described below).\
\n* `"meta"`: non-standard meta-information about a resource that can not berepresented as an attribute or relationship.', function(resourceObject){
    if(resourceObject.hasOwnProperty('links'))
        this.provides('links', resourceObject.links);
    if(resourceObject.hasOwnProperty('meta'))
        this.provides('meta', resourceObject.meta);
});

assertion('A resource object **MAY** contain additional top-level members. These members represent "[attributes]" and may contain any valid JSON value.', function(resourceObject){
    for(key in resourceObject){
        if(resourceObject.hasOwnProperty(key) && !'links' === key && !'meta' === key)
            this.provides('attributeValue', resourceObject[key]);
    }
});
