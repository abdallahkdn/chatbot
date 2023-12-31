import { useState } from 'react'
import './App.css'
import '@chatscope/chat-ui-kit-react-styles/dist/default/StyleSheet.min.css';
import {MainContainer,ChatContainer,MessageList,MessageInput,TypingIndicator} from'@chatscope/chat-ui-kit-react'
const API_KEY="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";
function App() {
  const [typing,setTyping]=useState(false);
  const [messages, setMessages] = useState({
    messages:"Hello i am ChatGPT",
    sender:"ChatGPT"
  })
  const handleSend=async(message)=>{
    const newMessage={
      message:message,
      sender:"user",
      direction:"outgoing"
    }
    const newMessages=[...messages,newMessage];
    setMessages(newMessages);
    setTyping(true);
    await processMessageToChatGPT(newMessages);
    
  }
  async function processMessageToChatGPT(chatMessages){
    let apiMessage= chatMessages.map((messageObject) =>{
      let role="";
      if(messageObject.sender==="ChatGPT"){
        role="assistant"
      }
      else{
        role="user"
      }
      return{role: role,content: messageObject.message}

    });
    const systemMessage={
      role:"system",
      content:"explai all concepts like i am 10 years old"
    }

    const apiRequestBody={
      "model":"gpt-3.5-turbo",
      "messages":[
        systemMessage,
        ...apiMessages
      ]
    }

    await fetch("https://api.openai.com/v1/chat/completions",{
      method:"POST",
      headers:{
        "Authorization":"Bearer "+API_KEY,
        "Content-Type":"application/json"

      },
      body:JSON.stringify(apiRequestBody)

    }).then((data)=>{
      return data.json();

    } ).then((data)=>{
      console.log(data);
      console.log(data.choices[0].message.content);
      setMessages(
        [...chatMessages,{
          message:data.choices[0].message.content,
          sender:"ChatGPT"
        }]
      );
      setTyping(false);
    });
  }
  return (
    <div classname="App">
      <div style={{position:"relative",height:"800px",width:"700px"}}></div>
      <MainContainer>
        <ChatContainer>
          <MessageList
          typingIndicator={typing? <TypingIndicator content="ChatGPT istyping"/>:null}
          >
            {messages.map((message,i)=>{
              return <Message key={i}model={message}/>
            })}
          </MessageList>
          <MessageInput placeholder='Type message here' onSend={handleSend}/>
        </ChatContainer>
      </MainContainer>
     
    </div>
  )
}
const elementName = 'hello-chat-gpt';
export default App
customElements.define("hello-chat-gpt", PLUGIN);
