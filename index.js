// Checkout/Cart events listener
$(window).on('orderFormUpdated.vtex', function () {
    console.log("Someone changed the orderForm!");
    
    switch (window.location.hash) {
        case '#/cart':
            console.log("Translating Cart");
            TranslateCart();
        break;
        default:
            console.log("Still nothing");
            //TranslateCheckout();
    }
});

window.addEventListener('hashchange', function(event) {
    var check = document.querySelector('#CustomName');

    //Check if there are CustomName Elements
    if (check == null){
        console.log('Translate Checkout');
        TranslateCheckout();
    } else {}

  });

async function TranslateCart() {
    //Defines the new element that renders the new translated name
    const cartName = [];
    const cktName = [];

    var locale = vtexjs.checkout.orderForm.clientPreferencesData.locale;
    console.log(locale);

    var skuIDs = [];
    var elementIds = [];
    var items = vtexjs.checkout.orderForm.itemMetadata.items;
    var host = window.location.host;


    for (var i = 0, l = items.length; i < l; i++) {
        skuIDs[i] = items[i].id;
        elementIds[i] = "product-name" + skuIDs[i];
    }

    //search-graphql call
    var x = await fetch('https://' + host + '/_v/private/graphql/v1?locale=' + locale, {
        method: 'POST',
        headers: { 'Content-type': 'application-json' },
        body: JSON.stringify({ "query": "query($identifier:ProductUniqueIdentifierField!, $ids:[ID!]){ productsByIdentifier(field:$identifier, values:$ids) @context(provider: \"vtex.search-graphql\"){productName  }}", "variables": { "identifier": "sku", "ids": skuIDs } }),
    });
    var getTranslationData = await x.json();

    var translatedProducts = getTranslationData.data.productsByIdentifier;

    for (var i = 0, l = items.length; i < l; i++) {
        cartName[i] = document.createElement('a');
        cartName[i].innerText = translatedProducts[i]?.productName;
        //console.log(translatedProducts[i])

        //translates the cart
        document.querySelector('#' + elementIds[i]).after(cartName[i]);
    }
}

async function TranslateCheckout() {
    //Defines the new element that renders the new translated name
    const cktName = [];

    var locale = vtexjs.checkout.orderForm.clientPreferencesData.locale;
    console.log(locale);

    var skuIDs = [];
    var elementIds = [];
    var items = vtexjs.checkout.orderForm.itemMetadata.items;
    var host = window.location.host;


    for (var i = 0, l = items.length; i < l; i++) {
        skuIDs[i] = items[i].id;
        elementIds[i] = "product-name" + skuIDs[i];
    }

    //search-graphql call
    var x = await fetch('https://' + host + '/_v/private/graphql/v1?locale=' + locale, {
        method: 'POST',
        headers: { 'Content-type': 'application-json' },
        body: JSON.stringify({ "query": "query($identifier:ProductUniqueIdentifierField!, $ids:[ID!]){ productsByIdentifier(field:$identifier, values:$ids) @context(provider: \"vtex.search-graphql\"){productName  }}", "variables": { "identifier": "sku", "ids": skuIDs } }),
    });

    var getTranslationData = await x.json();
    var translatedProducts = getTranslationData.data.productsByIdentifier;

    for (var i = 0, l = items.length; i < l; i++) {
        cktName[i] = document.createElement('span');
        cktName[i].innerText = translatedProducts[i]?.productName;
        cktName[i].id = 'CustomName';
        //console.log(translatedProducts[i])

        //translates the checkout
        jQuery('li[data-sku="' + skuIDs[i] + '"] span.product-name')[0].after(cktName[i])
    }
}