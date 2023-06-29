
import Header from "./component/Header";
import Main from "./component/Main";
import {useEffect, useReducer} from "react";
import Loader from "./component/Loader";
import Error from "./component/Error";
import StartScreen from "./component/StartScreen";
import Question from "./component/Question";
import NextButton from "./component/NextButton";
import ProgressBar from "./component/ProgressBar";
import FinishedScreen from "./component/FinishedScreen";
import Footer from "./component/Footer";
import Timer from "./component/Timer";



const initialState = {
    questions:[],
    status:'loading',
    index:0,
    answer:null,
    points:0,
    highScore:0,
    secondsRemaining:1500
}
const reducer = (state, action) => {

    const {type, payload} = action

    switch (type){

        case 'dataRecieved':

            return  {
                ...state,
                status:'ready',
                questions:payload
            }

        case 'dataFailed':

            return  {
                ...state,
                status:'error'
            }

        case 'start':

            return  {
                ...state,
                status:'active'
            }
        case 'correctAnswer':

            const question = state.questions.at(state.index)



            return  {
                ...state,
                answer:payload,
                points:payload === question.correctOption? state.points + question.points:state.points
            }

        case 'nextQuestion':

            return  {
                ...state,
                index:state.index+1,
                answer:null
            }

        case 'Finished':

            return  {
                ...state,
                highScore: state.points > state.highScore? state.points: state.highScore,
                status:'finished'
            }


        case 'Restart':

            return  {
                ...state,
                status:'ready',
                index:0,
                answer:null,
                points:0,
                highScore:0

                //OR
                //...initialState
                //status:ready,
                //questions:state,questions
            }


        case "tick":
            return {
                ...state,
                secondsRemaining: state.secondsRemaining - 1,
                status: state.secondsRemaining === 0 ? "finished" : state.status,
            };
        default:
          throw new Error('action unknown')
    }
}
function App() {



    const [state, dispatch] = useReducer(reducer, initialState);

    const {status, questions, index, answer, points, highScore,secondsRemaining } = state


    const numQuestions = questions.length

    const maxPossiblePoints = questions.reduce((prev, acc) => prev + acc.points , 0)


    useEffect(() => {

        const fetchQuestions  = async() => {

            try {

                const res = await fetch('https://react-questions-app.netlify.app/questions')

                console.log(res)
                const data = await res.json()
                console.log(data)

                dispatch({type: 'dataRecieved', payload:data})

            } catch (err) {

                dispatch({type:'dataFailed'})
                console.log(err.message)
            }
        }

        fetchQuestions()

    }, []);

    return (
      <div className="app">
          <Header/>

   <Main>
       {status === 'loading' && <Loader/>}
       {status === 'error' && <Error/>}
       {status === 'loading' && <Loader/>}
       {status === 'ready' && <StartScreen numQuestions={numQuestions} dispatch={dispatch}/>}
       {status === 'active' &&



           (
               <>
                   <ProgressBar points={points} answer={answer} numQuestions={numQuestions} index={index} maxPossiblePoints={maxPossiblePoints}/>

                   <Question question={questions[index]} dispatch={dispatch} answer={answer} numQuestions={numQuestions}/>

                   <Footer>
                       <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
                       <NextButton
                           dispatch={dispatch}
                           answer={answer}
                           numQuestions={numQuestions}
                           index={index}
                       />
                   </Footer>
               </>






           )}

       {
           status ==='finished' &&(
               <FinishedScreen points={points} maxPossiblePoints={maxPossiblePoints} highScore={highScore} dispatch={dispatch}/>
           )
       }


   </Main>
      </div>
  );
}

export default App;




