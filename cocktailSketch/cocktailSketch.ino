#include <WiFi.h>       // For connecting ESP32 to WiFi
#include <WebServer.h>  // ESP32 web server library
#include <ArduinoOTA.h> // For enabling over-the-air updates

const char *ssid = "Uliel";
const char *password = "0542400393";

const int ledPin1 = 18;
const int ledPin2 = 19;

WebServer server(80); // Web server object for ESP32

void setup()
{
    pinMode(ledPin1, OUTPUT);
    digitalWrite(ledPin1, LOW); // Ensure LED is initially off
    pinMode(ledPin2, OUTPUT);
    digitalWrite(ledPin2, LOW); // Ensure LED is initially off
    pinMode(6, OUTPUT);
    for (int i = 1; i < 18; i++)
    {
        digitalWrite(6, LOW);
        delay(500);
        digitalWrite(6, HIGH);
        delay(500);
        digitalWrite(6, LOW);
        delay(500);
    }
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

    server.on("/martini", HTTP_GET, martini);
    server.on("/margarita", HTTP_GET, margarita);
    server.on("/turn-off", HTTP_GET, handleOff);

    server.begin();
    Serial.println("HTTP server started");
}

void loop()
{
    server.handleClient();
    ArduinoOTA.handle(); // Handle OTA updates
}

void margarita()
{
    digitalWrite(ledPin1, HIGH);
    server.send(200, "text/plain", "LED 1 is ON");
}

void martini()
{
    digitalWrite(ledPin2, HIGH);
    server.send(200, "text/plain", "LED 2 is ON");
}

void handleOff()
{
    digitalWrite(ledPin1, LOW);
    digitalWrite(ledPin2, LOW);
    server.send(200, "text/plain", "Both LEDs are OFF");
}
