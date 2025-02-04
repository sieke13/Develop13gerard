import  { useState, useEffect } from 'react';
import { Candidate } from '../interfaces/Candidate.interface';

const SavedCandidates = () => {
  const [savedCandidates, setSavedCandidates] = useState<Candidate[]>([]);
  const [title, setTitle] = useState("Potential Candidates");

  useEffect(() => {
    const savedCandidates = JSON.parse(localStorage.getItem('selectedCandidates') || '[]');
    if (savedCandidates.length > 0) {
      setSavedCandidates(savedCandidates);
      console.log(savedCandidates[0]);
    }
  }, []);

  const listItems = savedCandidates.map(c =>
    <tr key={c.id}>
      <td>
        <img
          src={c.avatar}
          alt={c.name}
          style={{ display: "block", marginLeft: "auto", marginRight: "auto", width: "30%" }}
        />
      </td>
      <td>
        {c.name}
      </td>
      <td>
        {c.location ? c.location : "Not set"}
      </td>
      <td>
        {c.email ? c.email : "Not set"}
      </td>
      <td>
        {c.company ? c.company : "Not set"}
      </td>
      <td>
        {c.bio ? c.bio : "Not set"}
      </td>
      <td style={{ display: "flex", justifyContent: "center" }}>
        <button id={c.id.toString()} onClick={() => {
          setSavedCandidates(
            savedCandidates.filter(a => a.id !== c.id)
          );
          const leftCandidates = savedCandidates.filter(a => a.id !== c.id);
          console.log(leftCandidates.length);
          leftCandidates.length > 0 ? setTitle("Potential Candidates") : setTitle("No more Candidates");
        }} > - </button>
      </td>
    </tr>
  );

  return (
    <>
      <table style={{ width: "100%" }}>
        <caption><h1>{title}</h1></caption>
        <thead>
          <tr>
            <th style={{ width: "20%" }}>Image</th>
            <th>Name</th>
            <th>Location</th>
            <th>Email</th>
            <th>Company</th>
            <th>Bio</th>
            <th>Reject</th>
          </tr>
        </thead>
        <tbody>
          {listItems}
        </tbody>
      </table>
    </>
  );
};

export default SavedCandidates;
