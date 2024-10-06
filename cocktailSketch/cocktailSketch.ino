#include <ESP8266WiFi.h>
#include <FirebaseESP8266.h>

// Wi-Fi credentials
const char *ssid = "Galaxy";
const char *password = "1234567890";

// Firebase credentials
#define FIREBASE_HOST "cocktails-6acf5-default-rtdb.asia-southeast1.firebasedatabase.app"
#define FIREBASE_AUTH "yGh0ZdBDXb1uBhsjR8wIanhQyK1aV3FEqavakevp" // Firebase database secret token

FirebaseData firebaseData;
FirebaseConfig firebaseConfig;
FirebaseAuth firebaseAuth;

const int builtInLed = BUILTIN_LED; // GPIO for built-in LED or motor simulation

// Function to connect to Wi-Fi
void setupWiFi()
{
    Serial.print("Connecting to Wi-Fi");
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(1000);
        Serial.print(".");
    }
    for (int counter = 0; counter < 10; counter++)
    {
        digitalWrite(builtInLed, HIGH);
        delay(100); // Wait for 200 millisecond(s)
        digitalWrite(builtInLed, LOW);
        delay(100); // Wait for 200 millisecond(s)
    }
    digitalWrite(builtInLed, LOW);
    Serial.println("Connected to Wi-Fi!");
}

void blinkLED(int numBlinks)
{
    for (int i = 0; i < numBlinks; i++)
    {
        digitalWrite(builtInLed, HIGH); // Turn the LED on
        delay(500);                     // Wait for half a second
        digitalWrite(builtInLed, LOW);  // Turn the LED off
        delay(500);                     // Wait for half a second
    }
}

// Function to prepare cocktails
void prepareCocktail(const String &drink, int quantity)
{
    Serial.println("Preparing " + drink);

    if (drink == "Margarita")
    {
        // Margarita preparation code
        blinkLED(2);
    }
    else if (drink == "Martini")
    {
        // Martini preparation code
        blinkLED(4);
    }
    else if (drink == "Bloody Mary")
    {
        // Bloody Mary preparation code
        blinkLED(6);
    }
    else if (drink == "Pina Colada")
    {
        // Pina Colada preparation code
        blinkLED(8);
    }
    else if (drink == "DIY")
    {
        // DIY (custom) drink preparation code
        blinkLED(10);
    }
    else
    {
        Serial.println("Unknown drink!");
    }

    Serial.printf("%s prepared!\n", drink.c_str());
}

void setup()
{
    pinMode(builtInLed, OUTPUT); // Set motor pin as output
    digitalWrite(builtInLed, LOW);

    Serial.begin(115200);
    setupWiFi(); // Connect to Wi-Fi

    // Configure Firebase
    firebaseConfig.database_url = FIREBASE_HOST;
    firebaseConfig.signer.tokens.legacy_token = FIREBASE_AUTH; // Set Firebase Auth token

    // Initialize Firebase with both config and auth
    Firebase.begin(&firebaseConfig, &firebaseAuth);
    Firebase.reconnectWiFi(true); // Automatically reconnect to Wi-Fi if disconnected

    Serial.println("Firebase setup complete.");
}

void loop()
{
    // Check if the order status is 'pending'
    if (Firebase.getString(firebaseData, "/orderStatus"))
    {
        String orderStatus = firebaseData.stringData();
        if (orderStatus == "pending")
        {
            // Fetch the cocktail name
            if (Firebase.getString(firebaseData, "/cocktailName"))
            {
                String cocktail = firebaseData.stringData();
                Serial.println("Order received, preparing " + cocktail);

                prepareCocktail(cocktail, 1); // Modify the quantity as needed

                // After preparing, update Firebase to mark the order as "complete"
                Firebase.setString(firebaseData, "/orderStatus", "complete");
                Serial.println("Order completed and status updated to 'complete'.");
            }
            else
            {
                Serial.println("Failed to retrieve cocktail name");
                Serial.println("Error: " + firebaseData.errorReason()); // Print error if cocktailName fails
            }
        }
    }
    else
    {
        Serial.println("Failed to retrieve order status");
        Serial.println("Error: " + firebaseData.errorReason()); // Print error reason for orderStatus failure
    }

    delay(500); // Delay for the next check
}