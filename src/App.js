import React, { useEffect } from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import {nanoid} from "nanoid"
import { onSnapshot , addDoc, doc, deleteDoc, setDoc} from "firebase/firestore"
import { notesCollection, db } from "./firebase"


import "../src/css/style.css"


export default function App() {
    const [notes, setNotes] = React.useState([])

    const [currentNoteId, setCurrentNoteId] = React.useState(
        (notes[0] && notes[0].id) || "")


    const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt)


    useEffect(() => {
        const unsubscribe = onSnapshot(notesCollection, function(snapshot) {
            // Sync up our local notes array with the snapshot data
            const notesArr = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))
            setNotes(notesArr)
        })
        return unsubscribe
    }, [])

    
    async function createNewNote() {
        const newNote = {
            body: "# Type your markdown note's title here",
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
        const newNoteRef = await addDoc(notesCollection, newNote)
        setCurrentNoteId(newNoteRef.id)
    }
    
    async function updateNote(text) {
        const docRef = doc(db, "notes", currentNoteId)
        await setDoc(docRef, {body: text, updatedAt: Date.now()}, { merge: true })
        /*setNotes(oldNotes => {
          const newArr = []
          for(let i=0; i<oldNotes.length; i++){
            const oldNote = oldNotes[i]
            if(oldNote.id === currentNoteId){
              newArr.unshift({...oldNote, body: text})
            } else newArr.push(oldNote)
          }
          return newArr;
        })*/
    }
    

    async function deleteNote(noteId) {
        const docRef = doc(db, "notes", noteId)
        await deleteDoc(docRef)
        /*setNotes(oldNotes => {
            const newArr = []
            for(let i=0; i<oldNotes.length; i++){
              const oldNote = oldNotes[i]
              if(oldNote.id !== noteId){
                newArr.push(oldNote)
              } 
            }
            return newArr;
          })*/
    }



    function findCurrentNote() {
        return notes.find(note => {
            return note.id === currentNoteId
        }) || notes[0]
    }
    
    return (
        <main>
        {
            notes.length > 0 
            ?
            <Split 
                sizes={[30, 90]} 
                direction="horizontal" 
                className="split"
            >
                <Sidebar
                    notes={sortedNotes}
                    currentNote={findCurrentNote()}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                    deleteNote={deleteNote}
                />
                {
                    currentNoteId && 
                    notes.length > 0 &&
                    <Editor 
                        currentNote={findCurrentNote()} 
                        updateNote={updateNote} 
                    />
                }
            </Split>
            :
            <div className="no-notes">
                <h1>You have no notes</h1>
                <button 
                    className="first-note" 
                    onClick={createNewNote}
                >
                    Create one now
                </button>
            </div>
            
        }
        </main>
    )
}
