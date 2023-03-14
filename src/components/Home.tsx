import * as Mui from "@mui/material"

import { useState, useEffect, Suspense, FC, ReactElement, ExoticComponent } from 'react'

import GameLauncher from './GameLauncher'
import Game from './Game'
import { searchTriviaAPI } from '../SearchAPIHelper'
import PostGame from "./PostGame"
import React from "react"
import { GameSettings } from "../types/GameSettings"

const Home: FC = (): ReactElement => {

    let [triviaSpecs, setTriviaSpecs] = useState<GameSettings | null>(null)
    let [api_url, setApi_Url] = useState<string>('') // Stores the parsed api url.
    let [data, setData] = useState<any>(null) // Stores the data fetched from the trivia api.
    let [postGameData, setPostGameData] = useState<any>(null)

    // Takes the trivia parameters specified in the Game Launcher component, parses them into the api query string and stores the completed url within the 'api_url' variable.
    const handleSettings = (settings: GameSettings): void => {
        setTriviaSpecs(settings)
        let category: string = settings.category === 'random' ? '' : `categories=${settings.category}`
        let limit: string = `&limit=${settings.limit}`
        let difficulty: string = settings.difficulty === 'random' ? '' : `&difficulty=${settings.difficulty}`
        let API_URL: string = 'https://the-trivia-api.com/api/questions?' + category + limit + difficulty
        setApi_Url(API_URL)
    }

    const resetSettings = (): void => {
        setTriviaSpecs(null)
        setApi_Url('')
        setPostGameData(null)
        setData(null)
    }

    const handlePostGameData = (postGameResults: any): void => {
        setPostGameData(postGameResults)
    }

    // Once 'api_url' has been assigned a new api url value, a fetch request is sent with the result stored within the 'data' variable.
    useEffect((): void => {
        if (api_url) {
            setData(searchTriviaAPI(api_url))
        }
    }, [api_url])

    // Renders the game once the trivia data has been received, otherwise Game Launcher gets rendered.
    const renderGame = (): JSX.Element | ExoticComponent => {
        if (data) {
            if (postGameData) {
                return (
                    <PostGame postGameData={postGameData} triviaSpecs={triviaSpecs} resetSettings={resetSettings} />
                )
            }
            else {
                return (
                    <Suspense fallback={<Mui.CircularProgress />}>
                        <Game data={data} resetSettings={resetSettings} handlePostGameData={handlePostGameData} />
                    </Suspense>
                )
            }
        } else {
            return (
                <GameLauncher handleSettings={handleSettings} />
            )
        }
    }

    return (
        <>

            <h1>TRIVIA MASTER</h1>

            {renderGame()}

        </>
    )
}

export default Home