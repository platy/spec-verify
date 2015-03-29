

assertion("A JSON object **MUST** be at the root of every JSON API response containing data.", function(document){
    assert(document.isObject() && !document.isArray());
});

assertion("A document **MUST** contain either primary data or an array of [error objects](#errors).", function(document){
    oneOf(
        assertion('Primary data **MUST** appear under a top-level key named `"data"`.', function() {
            assert(document.data !== undefined);
            provide('primaryData', document.data);
        }),
        assertion('Error objects **MUST** appear under a top-level key named `"errors"`.', function() {
            assert(document.errors !== undefined);
            provide('errors', document.errors);
        })
    )
});

assertion("Primary data **MUST** be either a single resource object, an array of resource objects, or a value representing a resource relationship.", function(primaryData){
    if(Object.isArray(primaryData)) {
        primaryData.forEach(function (resourceObject) {
            provide('resourceObject', resourceObject);
        })
    } else {
        oneOf(
            provide('resourceObject', primaryData),
            provide('resourceRelationship', primaryData)
        )
    }
});

assertion("If any of these members appears in the top-level of a response, their values **MUST** comply with this specification.", function(document) {
    if(document.hasOwnProperty('meta'))
        provide('meta', document.meta);
    if(document.hasOwnProperty('links'))
        provide('links', document.links);
    if(document.hasOwnProperty('included'))
        provide('included', document.included);
});

assertion('A resource object **MUST** contain at least the following top-level members:\
\
* `"id"`\
* `"type"`\
\
Exception: The `id` member is not required when the resource object originates at\
the client and represents a new resource to be created on the server.', function(resourceObject){
    assert(resourceObject.hasOwnProperty('type'));
}, function(response, resourceObject){
    assert(resourceObject.hasOwnProperty('id'));
});

assertion('In addition, a resource object **MAY** contain any of these top-level members:\
\
* `"links"`: a "links object", providing information about a resource\'s relationships (described below).\
* `"meta"`: non-standard meta-information about a resource that can not berepresented as an attribute or relationship.', function(resourceObject){
    if(resourceObject.hasOwnProperty('links'))
        provide('links', resourceObject.links);
    if(resourceObject.hasOwnProperty('meta'))
        provide('meta', resourceObject.meta);
});

assertion('A resource object **MAY** contain additional top-level members. These members represent "[attributes]" and may contain any valid JSON value.', function(resourceObject){
    for(key in resourceObject){
        if(resourceObject.hasOwnProperty(key) && !'links' === key && !'meta' === key)
            provide('attributeValue', resourceObject[key]);
    }
});