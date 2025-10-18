<?php
// -------------------------------
// Hire Me Payment + Appointment Integration
// Hosted on Vercel with environment variables
// -------------------------------

// Read credentials from environment variables
$clientId = getenv('CASHFREE_APP_ID');
$clientSecret = getenv('CASHFREE_SECRET_KEY');
$apiVersion = "2025-01-01";
$environment = "production"; // change to 'sandbox' if needed
$adminEmail = "kanchanmaji@zohomail.in";

// Check if the request is POST (form submitted)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Collect user info from form
    $customer_name  = htmlspecialchars($_POST['name']);
    $customer_email = htmlspecialchars($_POST['email']);
    $customer_phone = htmlspecialchars($_POST['phone']);
    $appointment_for = htmlspecialchars($_POST['appointment_for']);

    // Create order on Cashfree
    $baseUrl = ($environment === "sandbox")
        ? "https://sandbox.cashfree.com/pg/orders"
        : "https://api.cashfree.com/pg/orders";

    $orderData = [
        "order_id" => "ORDER_" . time(),
        "order_amount" => 10.00, // Fixed price for appointment
        "order_currency" => "INR",
        "customer_details" => [
            "customer_id" => "CUST_" . rand(1000,9999),
            "customer_name" => $customer_name,
            "customer_email" => $customer_email,
            "customer_phone" => $customer_phone
        ],
        "order_note" => "Hire Me Appointment Booking",
        "order_meta" => [
            "return_url" => "https://codewithkanchan.com/hireme.php?status=success&order_id={order_id}&name={$customer_name}&appointment_for={$appointment_for}",
            "notify_url" => "https://codewithkanchan.com/hireme.php?status=notify&order_id={order_id}"
        ]
    ];

    $curl = curl_init();
    curl_setopt_array($curl, [
        CURLOPT_URL => $baseUrl,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST => "POST",
        CURLOPT_POSTFIELDS => json_encode($orderData),
        CURLOPT_HTTPHEADER => [
            "Content-Type: application/json",
            "x-client-id: $clientId",
            "x-client-secret: $clientSecret",
            "x-api-version: $apiVersion"
        ],
    ]);

    $response = curl_exec($curl);
    $err = curl_error($curl);
    curl_close($curl);

    if ($err) {
        die("Error creating order: $err");
    }

    $result = json_decode($response, true);
    if (!isset($result['payment_session_id'])) {
        die("Error creating order: " . htmlspecialchars($response));
    }

    $paymentSessionId = $result['payment_session_id'];
    $orderId = $result['order_id'];

    // Render the checkout page
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Hire Me Payment</title>
        <script src="https://sdk.cashfree.com/js/v3/cashfree.js"></script>
        <style>
            body { font-family: Arial, sans-serif; background: #f0f0f0; text-align: center; padding-top: 100px;}
            .container { background: #fff; display: inline-block; padding: 40px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);}
            button { background: #2d7cf6; color: #fff; border: none; padding: 15px 25px; border-radius: 8px; font-size: 18px; cursor: pointer; margin-top: 20px;}
            button:hover { background: #1450d2; }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>💳 Pay ₹10 to Book Appointment</h2>
            <p>Order ID: <strong><?= htmlspecialchars($orderId) ?></strong></p>
            <button id="payBtn">Pay Now</button>
        </div>

        <script>
            const cashfree = Cashfree({ mode: "<?= $environment ?>" });
            document.getElementById("payBtn").addEventListener("click", () => {
                cashfree.checkout({
                    paymentSessionId: "<?= $paymentSessionId ?>",
                    redirectTarget: "_self"
                }).then(res => console.log("Checkout result:", res))
                  .catch(err => { console.error("Checkout error:", err); alert("Error: " + err.message); });
            });
        </script>
    </body>
    </html>
    <?php
    exit;
}

// Handle return_url for successful payment
if (isset($_GET['status']) && $_GET['status'] === 'success') {
    $orderId = htmlspecialchars($_GET['order_id']);
    $customer_name = htmlspecialchars($_GET['name']);
    $appointment_for = htmlspecialchars($_GET['appointment_for']);

    // Send email to admin
    $subject = "New Appointment Booked: $orderId";
    $message = "Appointment Details:\n\nOrder ID: $orderId\nCustomer: $customer_name\nAppointment For: $appointment_for\nPayment Status: Success";
    mail($adminEmail, $subject, $message);

    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Appointment Confirmed</title>
        <style>
            body { font-family: Arial, sans-serif; background: #e6f7ff; text-align: center; padding-top: 100px;}
            .container { background: #fff; display: inline-block; padding: 40px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);}
            h2 { color: #2d7cf6; }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>✅ Payment Successful!</h2>
            <p>Order ID: <strong><?= $orderId ?></strong></p>
            <p>Thank you, <strong><?= $customer_name ?></strong>. Your appointment for <strong><?= $appointment_for ?></strong> is confirmed.</p>
            <p>Admin has been notified.</p>
        </div>
    </body>
    </html>
    <?php
    exit;
}

// Default: Render the Appointment Form
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Book Appointment</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f0f4f7; display: flex; justify-content: center; align-items: center; height: 100vh;}
        form { background: #fff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); width: 400px;}
        h2 { text-align: center; margin-bottom: 20px; color: #2d7cf6;}
        input, select { width: 100%; padding: 12px; margin: 10px 0; border-radius: 6px; border: 1px solid #ccc; font-size: 16px;}
        button { background: #2d7cf6; color: #fff; padding: 15px; border: none; border-radius: 8px; width: 100%; font-size: 18px; cursor: pointer; margin-top: 20px;}
        button:hover { background: #1450d2; }
    </style>
</head>
<body>
    <form method="POST">
        <h2>Book Your Appointment</h2>
        <input type="text" name="name" placeholder="Full Name" required>
        <input type="email" name="email" placeholder="Email Address" required>
        <input type="tel" name="phone" placeholder="Phone Number" required>
        <select name="appointment_for" required>
            <option value="">Select Appointment Type</option>
            <option value="1-on-1 Coding Session">1-on-1 Coding Session</option>
            <option value="Website Consultation">Website Consultation</option>
            <option value="Tech Guidance">Tech Guidance</option>
        </select>
        <button type="submit">Proceed to Payment</button>
    </form>
</body>
</html>
