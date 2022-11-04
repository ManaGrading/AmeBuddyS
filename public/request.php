<?php
ini_set('display_errors', 1);

$title = $_REQUEST['title'];
$description = $_REQUEST['description'];
$sku = $_REQUEST['sku'];
$card_serial = $_REQUEST['card_serial']; // '29792'
$price = floatval($_REQUEST['price']);
$offer_price = floatval($_REQUEST['offer_price']);
$lowest_offer = floatval($_REQUEST['lowest_offer']);
$domestic_shipping = floatval($_REQUEST['domestic_shipping']);
$international_shipping = floatval($_REQUEST['international_shipping']);
// $ad_budget = $_REQUEST['ad_budget'];
$images = $_REQUEST['images'];

$postRequest = array(
    'title' => $title,
    'description' => $description,
    'sku' => $sku,
    'card_serial' => $card_serial,
    'price' => $price,
    'offer_price' => $offer_price,
    'lowest_offer' => $lowest_offer,
    'domestic_shipping' => $domestic_shipping,
    'international_shipping' => $international_shipping,
    'sandbox' => true,
    'images' => array(
        'https://managrading.com/EbayCode/working-demo/images/project_02.png',
        'https://managrading.com/EbayCode/working-demo/images/Our-Approch.png'
    )
);

$cURLConnection = curl_init('https://www.managrading.com/EbayCode?' . http_build_query($postRequest));
curl_setopt($cURLConnection, CURLOPT_RETURNTRANSFER, true);
curl_setopt($cURLConnection, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($cURLConnection, CURLOPT_HTTPHEADER, array(
  'Authorization: Bearer cHCXqu57pmiFVl6CXv9gftS7A4I9wqzUbzWgsitJJFakTqf35gyN7R0gR8RMidTYg7nHbVLXWcP0AIjQ'
));

$apiResponse = curl_exec($cURLConnection);
curl_close($cURLConnection);

// $apiResponse - available data from the API request
$jsonArrayResponse = json_decode($apiResponse);

echo "<pre>";print_r($jsonArrayResponse);
exit;
