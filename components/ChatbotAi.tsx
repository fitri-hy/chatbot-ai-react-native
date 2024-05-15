import { useState, useEffect } from 'react';
import { View, TextInput, Button, ScrollView, StyleSheet, ActivityIndicator, Text, Dimensions } from 'react-native';
import Markdown from 'react-native-markdown-display';

const ChatBot = () => {
  const [inputText, setInputText] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const screenHeight = Dimensions.get('window').height;

  const sendMessage = async () => {
    if (inputText.trim() === '') return;

    setLoading(true);

    try {
      const response = await fetch(`https://api.hy-tech.my.id/api/gemini/${encodeURIComponent(inputText)}`);
      const data = await response.json();

      setChatHistory([...chatHistory, { text: inputText, fromUser: true }, { text: data.text, fromUser: false }]);
      setInputText('');
    } catch (error) {
      console.error('Error fetching data:', error);
    }

    setLoading(false);
  };

  useEffect(() => {
    sendMessage();
  }, []);

  return (
    <View style={[styles.container]}>
      <ScrollView contentContainerStyle={styles.chatContainer}>
        {chatHistory.map((message, index) => (
          <View key={index} style={{ alignSelf: message.fromUser ? 'flex-end' : 'flex-start' }}>
            <View style={[styles.messageContainer, { alignSelf: message.fromUser ? 'flex-end' : 'flex-start' }]}>
              {message.fromUser ? (
                <Text style={styles.messageText}>{message.text}</Text>
              ) : (
                <Markdown style={styles.messageText}>{message.text}</Markdown>
              )}
            </View>
          </View>
        ))}
        {loading && <ActivityIndicator style={styles.loadingIndicator} size="small" color="#0000ff" />}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your question ..."
          value={inputText}
          onChangeText={setInputText}
        />
        <Button title="Ask" onPress={sendMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatContainer: {
    marginTop: 60,
  },
  inputContainer: {
    position: 'fixed',
    paddingBottom: 10,
    backgroundColor: '#ffffff',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.10,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
  },
  messageContainer: {
    marginBottom: 10,
    maxWidth: '100%',
    padding: 5,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  messageText: {
    fontSize: 16,
  },
  loadingIndicator: {
    marginTop: 10,
  },
});

export default ChatBot;
