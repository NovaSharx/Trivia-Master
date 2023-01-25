import * as Mui from "@mui/material"
import PublishRoundedIcon from '@mui/icons-material/PublishRounded';

import { useState, useEffect } from "react"
import axios from "axios"

export default function PostGame({ postGameData, triviaSpecs, resetSettings }) {

    const { performanceData, triviaData } = postGameData // Destructures the player's performance data and the trivia data

    let [playerName, setPlayerName] = useState('Anonymous') // Stores the player's name
    let [playerScore, setPlayerScore] = useState(0) // Stores the player's score
    let [openForm, setOpenForm] = useState(false)

    useEffect(() => {
        let score = 0

        for (let i = 0; i < performanceData.length; i++) {
            if (performanceData[i].isCorrect) {
                score += 10 * (performanceData[i].secondsLeft)
            }
        }

        setPlayerScore(score)
    }, [playerScore])

    // Posts the player's highscore to the Trivia Master database
    const submitHighscore = () => {
        // Sends highscore data to the post route of the database api
        axios.post("http://localhost:3001/api/posthighscore", {
            player_name: playerName,
            player_score: playerScore,
            question_count: triviaSpecs.limit,
            difficulty: triviaSpecs.difficulty,
            category: triviaSpecs.category
        }).then((result) => {
            console.log('Result: ', result)
            resetSettings()
            window.alert("Insert was successful")
        }).catch(err => {
            console.log('Error: ', err)
        })
    }

    // Render trivia results
    const renderPostGameData = performanceData.map((userResult, index) => {

        return (
            <Mui.Zoom key={index} in={true} style={{ transitionDelay: true ? `${200 * index}ms` : '0ms' }}>
                <Mui.Paper elevation={8} sx={{ border: `2px solid ${userResult.isCorrect ? 'green' : 'red'}` }}>
                    <Mui.Box sx={{ backgroundColor: userResult.isCorrect ? 'green' : 'red' }}>
                        <Mui.Typography color={'white'}>{index + 1}. {triviaData[index].question}</Mui.Typography>
                    </Mui.Box>
                    <Mui.Typography>Selection: <b>{userResult.choice}</b></Mui.Typography>
                    <Mui.Typography>Answer: <b>{triviaData[index].correctAnswer.toUpperCase()}</b></Mui.Typography>
                    <Mui.Typography>Answered In: <b>{30 - userResult.secondsLeft} second(s)</b></Mui.Typography>
                </Mui.Paper>
            </Mui.Zoom>
        )
    })

    const openHighscoreForm = () => {
        setOpenForm(true)
    }
    const closeHighscoreForm = () => {
        setOpenForm(false)
    }

    return (
        <div>

            <Mui.Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-evenly',
                margin: '50px auto',
                padding: '50px',
                width: '80vw',
                boxShadow: '0px 0px 20px 0px grey',
                borderRadius: '30px'
            }}>
                <Mui.Typography variant='h4'>POST GAME RESULTS</Mui.Typography>
                <br />
                <Mui.Button variant='contained' onClick={() => resetSettings()}>Back to Launcher</Mui.Button>
                <br />
                <Mui.Paper sx={{ padding: '10px' }}>
                    <Mui.Typography variant="h2">
                        Your Score: {playerScore}
                    </Mui.Typography>

                    <Mui.Button variant="contained" endIcon={<PublishRoundedIcon aria-label="Sumbit" />} onClick={openHighscoreForm}>
                        Submit Highscore
                    </Mui.Button>
                    <Mui.Dialog open={openForm} onClose={closeHighscoreForm}>
                        <Mui.DialogTitle>Post Your Highscore</Mui.DialogTitle>
                        <Mui.DialogContent>
                            <Mui.TextField
                                sx={{ margin: '5px' }}
                                id="submit-highscore"
                                label="Player Name"
                                defaultValue="Anonymous"
                                onChange={(e) => {setPlayerName(e.target.value)}}
                            />
                        </Mui.DialogContent>
                        <Mui.DialogActions>
                            <Mui.Button variant="outlined" onClick={closeHighscoreForm}>Cancel</Mui.Button>
                            <Mui.Button variant="contained" onClick={() => submitHighscore()}>Submit</Mui.Button>
                        </Mui.DialogActions>
                    </Mui.Dialog>

                </Mui.Paper>

                <Mui.Stack spacing={2} sx={{ margin: '10px' }}>
                    {renderPostGameData}
                </Mui.Stack>

            </Mui.Box>
        </div>
    )
}