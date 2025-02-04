import  { useState, useEffect } from 'react';
import img_avatar from './img_avatar.png';
import { Candidate } from '../interfaces/Candidate.interface';
import { searchGithubUser, searchGithub } from '../api/API';

const CandidateSearch = () => {
  const [candidateList, setCandidateList] = useState<string[]>([]);
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [selectedCandidates, setSelectedCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    localStorage.setItem('selectedCandidates', JSON.stringify(selectedCandidates));
  }, [selectedCandidates]);

  useEffect(() => {
    const getCandidates = async () => {
      try {
        console.log("Fetching candidates");
        const ticketResponseJSON = await searchGithub();
        console.log("Candidates fetched:", ticketResponseJSON);
        const candidateLogins = ticketResponseJSON.map((output: any) => output.login);
        setCandidateList(candidateLogins);

        if (candidateLogins.length > 0) {
          const candidateData = await searchGithubUser(candidateLogins[0]);
          console.log("First candidate data:", candidateData);
          const newCandidate: Candidate = {
            id: candidateData.id,
            name: candidateData.name,
            avatar: candidateData.avatar_url,
            location: candidateData.location,
            email: candidateData.email,
            company: candidateData.company,
            bio: candidateData.bio
          };
          setCandidate(newCandidate);
        }
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };
    getCandidates();
  }, []);

  const nextUser = async () => {
    if (candidate) {
      const filteredCandidates = candidateList.filter(login => login !== candidate.id.toString());
      if (filteredCandidates.length > 0) {
        setCandidateList(filteredCandidates);
        try {
          const candidateData = await searchGithubUser(filteredCandidates[0]);
          console.log("Next candidate data:", candidateData);
          if (candidateData) {
            setCandidate({
              id: candidateData.id,
              name: candidateData.name,
              avatar: candidateData.avatar_url,
              location: candidateData.location,
              email: candidateData.email,
              company: candidateData.company,
              bio: candidateData.bio
            });
          }
        } catch (err) {
          console.error("Error fetching next user", err);
          nextUser();
        }
      } else {
        setCandidate({
          id: 0,
          name: "No more candidates",
          avatar: img_avatar,
          location: "",
          email: "",
          company: "",
          bio: ""
        });
      }
    }
  };

  const nextUserAndSave = async () => {
    if (candidate) {
      setSelectedCandidates([...selectedCandidates, candidate]);
      await nextUser();
    }
  };

  return (
    <>
      <h1>Candidate Search</h1>
      <div className="card" style={{
        width: "320px", padding: "20px", borderRadius: "25px", border: "2px solid #ffffff"
      }}>
        <img src={candidate?.avatar || img_avatar} alt="Avatar" style={{ display: "block", marginLeft: "auto", marginRight: "auto", width: "50%" }} />
        <div className="container">
          <h4><b>{candidate?.name}</b></h4>
          <p>Location: {candidate?.location || "not set by the github user"}</p>
          <p>Email: {candidate?.email || "not set by the github user"}</p>
          <p>Company: {candidate?.company || "not set by the github user"}</p>
          <p>Bio: {candidate?.bio || "not set by the github user"}</p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button type="button" style={{ backgroundColor: "red", color: "white", padding: "10px 50px" }} onClick={nextUser}>-</button>
          <button type="button" style={{ backgroundColor: "green", color: "white", padding: "10px 50px" }} onClick={nextUserAndSave}>+</button>
        </div>
      </div>
    </>
  );
};

export default CandidateSearch;