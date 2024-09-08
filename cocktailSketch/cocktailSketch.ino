#include <WiFi.h>        // For connecting ESP32 to WiFi
#include <WebServer.h>   // ESP32 web server library
#include <ArduinoOTA.h>  // For enabling over-the-air updates
#include <ArduinoJson.h> // For parsing JSON data

const char *ssid = "Uliel";
const char *password = "0542400393";

const int margarita = 18;  // LED for Margarita
const int martini = 19;    // LED for Martini
const int bloodyMary = 21; // LED for Bloody Mary

WebServer server(80); // Web server object for ESP32

void setup()
{
    pinMode(margarita, OUTPUT);
    digitalWrite(margarita, LOW); // Ensure LED is initially off
    pinMode(martini, OUTPUT);
    digitalWrite(martini, LOW); // Ensure LED is initially off
    pinMode(bloodyMary, OUTPUT);
    digitalWrite(bloodyMary, LOW); // Ensure LED is initially off

    Serial.begin(115200);
    delay(10);

    WiFi.begin(ssid, password);
    Serial.print("Connecting to WiFi");
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
    }
    Serial.println("\nWiFi connected");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());

    ArduinoOTA.begin(); // Starts OTA

    server.on("/make_drink", HTTP_POST, handleMakeDrink);
    server.on("/turn-off", HTTP_GET, handleOff);
    server.on("/turn-on", HTTP_GET, handleOn);

    // Handle preflight (OPTIONS) requests
    server.onNotFound([]()
                      {
    if (server.method() == HTTP_OPTIONS) {
      handlePreflight();
    } else {
      server.send(404, "text/plain", "Not Found");
    } });

    server.begin();
    Serial.println("HTTP server started");
}

void loop()
{
    server.handleClient();
    ArduinoOTA.handle(); // Handle OTA updates
}

void handleMakeDrink()
{
    if (server.hasArg("plain") == false)
    {
        server.send(400, "text/plain", "Bad Request");
        return;
    }

    String body = server.arg("plain");
    Serial.println("Received Data: " + body); // Debugging line to check received data

    DynamicJsonDocument doc(1024);
    DeserializationError error = deserializeJson(doc, body);

    if (error)
    {
        Serial.print("JSON Deserialization failed: ");
        Serial.println(error.c_str());
        server.send(400, "text/plain", "Bad JSON format");
        return;
    }

    JsonArray orders = doc.as<JsonArray>();

    // Turn off all LEDs first
    digitalWrite(margarita, LOW);
    digitalWrite(martini, LOW);
    digitalWrite(bloodyMary, LOW);

    for (JsonObject order : orders)
    {
        String drink = order["drink"];
        int quantity = order["quantity"];

        Serial.println("Now making " + drink + " x " + String(quantity)); // Debugging line

        if (drink == "Margarita")
        {
            makeMargarita();
        }
        else if (drink == "Martini")
        {
            digitalWrite(martini, HIGH); // Turn on LED for Martini
            delay(1000);
            digitalWrite(martini, LOW);
        }
        else if (drink == "Bloody Mary")
        {
            digitalWrite(bloodyMary, HIGH); // Turn on LED for Bloody Mary
            delay(1000);
            digitalWrite(bloodyMary, LOW);
        }
    }

    // Send CORS headers
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.sendHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    server.send(200, "application/json", "{\"status\":\"success\"}");
}

void makeMargarita()
{
    for (int i = 0; i < 5; i++)
    {
        digitalWrite(margarita, HIGH); // Turn on LED for Margarita
        delay(500);
        digitalWrite(margarita, LOW);
        delay(500);
    }
}

void handleOff()
{
    digitalWrite(margarita, LOW);
    digitalWrite(martini, LOW);
    digitalWrite(bloodyMary, LOW);

    // Send CORS headers
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.sendHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    server.send(200, "text/plain", "All LEDs are OFF");
}

void handleOn()
{
    digitalWrite(margarita, HIGH);
    digitalWrite(martini, HIGH);
    digitalWrite(bloodyMary, HIGH);

    // Send CORS headers
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.sendHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    server.send(200, "text/plain", "All LEDs are On");
}

void handlePreflight()
{
    // Send CORS headers
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.sendHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
    server.send(204); // No content for OPTIONS requests
}