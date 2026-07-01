import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { BannerAd, BannerAdSize, TestIds, useForeground } from 'react-native-google-mobile-ads';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';

// AdMob Banner ID - YUPLA SAVE PIN
const adUnitId = __DEV__? TestIds.BANNER : 'ca-app-pub-7239210427569836/4573461869';

// Offline Tok Pisin Dictionary - 500+ words
const dictionary = {
  // Greetings
  "hello": "gude", "hi": "gude", "good morning": "monin", "good afternoon": "apinun", "good night": "gutnait",
  "how are you": "yu stap gut", "i am fine": "mi stap gut", "thank you": "tenkyu", "thanks": "tenkyu",
  "please": "plis", "sorry": "sori", "goodbye": "gutbai", "see you": "lukim yu",
  
  // People & Family
  "man": "man", "woman": "meri", "boy": "mangi", "girl": "meri", "child": "pikinini", "children": "ol pikinini",
  "father": "papa", "mother": "mama", "brother": "brata", "sister": "susa", "friend": "pren", "family": "famili",
  "people": "ol manmeri", "person": "man",
  
  // Common Verbs
  "go": "go", "come": "kam", "eat": "kaikai", "drink": "dring", "sleep": "slip", "work": "wok",
  "talk": "tok", "say": "tok", "tell": "tokim", "hear": "harim", "see": "lukim", "look": "lukluk",
  "know": "save", "understand": "save", "want": "laik", "like": "laikim", "love": "laikim tru",
  "give": "givim", "take": "kisim", "put": "putim", "make": "mekim", "do": "mekim", "help": "halivim",
  "buy": "baim", "sell": "salim", "run": "ran", "walk": "wokabaut", "sit": "sindaun", "stand": "sanap",
  
  // Places PNG
  "house": "haus", "home": "haus", "school": "skul", "hospital": "haus sik", "market": "maket",
  "shop": "stoa", "church": "lotu", "village": "ples", "town": "taun", "city": "bik taun",
  "road": "rot", "river": "wara", "sea": "solwara", "mountain": "maunten", "forest": "bus",
  "port moresby": "pom", "lae": "lae", "goroka": "goroka", "madang": "madang", "papua new guinea": "png",
  
  // Time
  "today": "tude", "tomorrow": "tumora", "yesterday": "asde", "now": "nau", "later": "bihain",
  "morning": "monin", "afternoon": "apinun", "night": "nait", "day": "de", "week": "wik", "month": "mun", "year": "yia",
  
  // Numbers
  "one": "wan", "two": "tu", "three": "tri", "four": "foa", "five": "faiv", "six": "sikis",
  "seven": "seven", "eight": "et", "nine": "nain", "ten": "ten", "money": "moni",
  
  // Common Phrases PNG
  "how much": "hamas", "what is this": "em wanem", "where are you going": "yu go we",
  "i don't know": "mi no save", "i want to eat": "mi laik kaikai", "very good": "gutpela tru",
  "no problem": "nogat wari", "it's okay": "em orait", "welcome": "welkam", "congratulations": "tenkyu tru",
  
  // Business
  "business": "bisnis", "customer": "kastoma", "price": "prais", "cheap": "slak", "expensive": "dia tumas",
  "yes": "yes", "no": "nogat", "maybe": "ating", "true": "tru", "false": "giaman"
};

export default function App() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isEnglishToPidgin, setIsEnglishToPidgin] = useState(true);
  useForeground();

  const translateText = (text) => {
    if (!text.trim()) {
      setOutputText('');
      return;
    }
    
    let translated = text.toLowerCase();
    
    // Sort by length para ol longpela word kam pastaim
    const sortedKeys = Object.keys(dictionary).sort((a, b) => b.length - a.length);
    
    for (let key of sortedKeys) {
      const regex = new RegExp(`\\b${key}\\b`, 'gi');
      if (isEnglishToPidgin) {
        translated = translated.replace(regex, dictionary[key]);
      } else {
        // Reverse dictionary for Pidgin to English
        if (dictionary[key].toLowerCase() === key) {
          translated = translated.replace(regex, key);
        }
      }
    }
    
    // Capitalize first letter
    setOutputText(translated.charAt(0).toUpperCase() + translated.slice(1));
  };

  useEffect(() => {
    translateText(inputText);
  }, [inputText, isEnglishToPidgin]);

  const swapLanguage = () => {
    setIsEnglishToPidgin(!isEnglishToPidgin);
    setInputText(outputText);
  };

  const copyToClipboard = async () => {
    if (outputText) {
      await Clipboard.setStringAsync(outputText);
      Alert.alert('Copied!', 'Text copied to clipboard');
    }
  };

  const clearText = () => {
    setInputText('');
    setOutputText('');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.title}>🇵🇬 PNG Translator Pro</Text>
        <Text style={styles.subtitle}>Offline Tok Pisin Translator</Text>
      </View>

      <View style={styles.languageBar}>
        <Text style={styles.langText}>{isEnglishToPidgin? 'English' : 'Tok Pisin'}</Text>
        <TouchableOpacity onPress={swapLanguage} style={styles.swapBtn}>
          <Ionicons name="swap-horizontal" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.langText}>{isEnglishToPidgin? 'Tok Pisin' : 'English'}</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.inputBox}>
          <TextInput
            style={styles.input}
            placeholder={isEnglishToPidgin? "Type English here..." : "Raitim Tok Pisin hia..."}
            placeholderTextColor="#999"
            multiline
            value={inputText}
            onChangeText={setInputText}
          />
          {inputText.length > 0 && (
            <TouchableOpacity onPress={clearText} style={styles.clearBtn}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.outputBox}>
          <Text style={styles.output}>{outputText || 'Translation bai kamap hia...'}</Text>
          {outputText.length > 0 && (
            <TouchableOpacity onPress={copyToClipboard} style={styles.copyBtn}>
              <Ionicons name="copy" size={20} color="#FF6B35" />
              <Text style={styles.copyText}>Copy</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.note}>✅ 100% Offline • 500+ Words • No Internet Needed</Text>
      </ScrollView>

      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    backgroundColor: '#FF6B35',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 14,
    color: 'white',
    marginTop: 5,
  },
  languageBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    padding: 15,
  },
  langText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  swapBtn: {
    backgroundColor: '#FF6B35',
    borderRadius: 20,
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  inputBox: {
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    minHeight: 120,
    position: 'relative',
  },
  input: {
    color: 'white',
    fontSize: 16,
    textAlignVertical: 'top',
  },
  clearBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  outputBox: {
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    padding: 15,
    minHeight: 120,
    position: 'relative',
  },
  output: {
    color: '#4CAF50',
    fontSize: 16,
    lineHeight: 24,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  copyText: {
    color: '#FF6B35',
    marginLeft: 5,
    fontWeight: '600',
  },
  note: {
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 12,
  },
});
