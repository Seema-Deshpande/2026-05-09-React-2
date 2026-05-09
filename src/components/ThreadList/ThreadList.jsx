import { Container } from "react-bootstrap";
import './ThreadList.css';
import ThreadCard from "./ThreadCard";

export default function ThreadList({ threads, onSelect }) {
      if (threads.length === 0) {
      return  <div> No threads to display </div>
    } 
  return (
    <Container fluid className="px-0">
      {threads.map((thread)=>{
        return (
          <ThreadCard
            key={thread._id}
            thread={thread}
            homePage   
            onSelect={onSelect}       
          />
        )
      })}
    </Container>
  );
}
