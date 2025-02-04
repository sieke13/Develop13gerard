import img_avatar from './img_avatar.png';
import { Candidate } from '../interfaces/Candidate.interface';
import { useState, useEffect } from 'react';
import { searchGithubUser, searchGithub } from '../api/API';

const CandidateSearch = () => {
  const [candidateList, setCandidateList] = useState<string[]>([]);
  const [currentCandidate, setCurrentCandidate] = useState({} as Candidate);
  const [selectedCandidates, setSelectedCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    localStorage.setItem('selectedCandidates', JSON.stringify(selectedCandidates));
  }, [selectedCandidates]);

  useEffect((): void => {
    const getCandidates = async () => {
      console.log("Fetching candidates");
      let response = await searchGithub();
      response.forEach((item: any) => (
        setCandidateList((candidateList) => [...candidateList, item.login])
      ));

      const candidateData = await searchGithubUser(response[0].login);
      const newCandidate: Candidate = {
        id: candidateData.id,
        login: response[0].login,
        avatar: candidateData.avatar_url,
        username: candidateData.node_id,
        location: candidateData.location,
        email: candidateData.email,
        company: candidateData.company,
        bio: candidateData.bio
      }
      setCurrentCandidate(newCandidate);
    }
    getCandidates();
  }, []);

  async function nextUser() {
    let filteredCandidates = candidateList.filter(candidate => candidate != currentCandidate.login)
    if (filteredCandidates.length > 0) {
      setCandidateList(filteredCandidates);
      try {
        const candidateData = await searchGithubUser(filteredCandidates[0]);
        if (candidateData) {
          setCurrentCandidate({
            id: candidateData.id,
            login: candidateData.login,
            avatar: candidateData.avatar_url,
            username: candidateData.node_id,
            location: candidateData.location,
            email: candidateData.email,
            company: candidateData.company,
            bio: candidateData.bio
          });
        }
      } catch (err) {
        console.log("Error fetching next user", err);
        nextUser();
      }
    } else {
      setCurrentCandidate({
        id: 0,
        login: "No more candidates",
        avatar: img_avatar,
        username: "",
        location: "",
        email: "",
        company: "",
        bio: ""
      })
    };
  }

  async function nextUserAndSave() {
    try {
      const candidateData = await searchGithubUser(currentCandidate.login);
      let newCandidate = { 
        id: candidateData.id, 
        login: candidateData.login, 
        avatar: candidateData.avatar_url, 
        username: candidateData.node_id, 
        location: candidateData.location, 
        email: candidateData.email, 
        company: candidateData.company, 
        bio: candidateData.bio 
      };
      setSelectedCandidates([...selectedCandidates, newCandidate]);
      nextUser();
    } catch (err) {
      console.log("Error saving candidate", err);
      nextUser();
    }
  }

  return (
    <>
      <h1>Candidate Search</h1>
      <div className="card" style={{
        width: "320px", padding: "20px", borderRadius: "25px", border: "2px solid #ffffff"
      }} >
        <img src={currentCandidate.avatar ? currentCandidate.avatar : img_avatar} alt="Avatar" style={{ display: "block", marginLeft: "auto", marginRight: "auto", width: "50%" }} />
        <div className="container">
          <h4><b>{currentCandidate.login} {currentCandidate.username ? `id: ${currentCandidate.username}` : ""}</b></h4>
          <p>Location: {currentCandidate.location ? currentCandidate.location : " not set by the github user"} </p>
          <p>Email:{currentCandidate.email ? currentCandidate.email : " not set by the github user"}</p>
          <p>Company:{currentCandidate.company ? currentCandidate.company : " not set by the github user"}</p>
          <p>Bio:{currentCandidate.bio ? currentCandidate.bio : " not set by the github user"}</p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button type="button" style={{ backgroundColor: "red", color: "white", padding: "10px 50px" }} onClick={nextUser}>-</button>
          <button type="button" style={{ backgroundColor: "green", color: "white", padding: "10px 50px" }} onClick={nextUserAndSave}>+</button>
        </div>
      </div>
    </>
  )
}

export default CandidateSearch;