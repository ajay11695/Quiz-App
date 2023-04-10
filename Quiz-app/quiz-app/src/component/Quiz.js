import React from "react";

class Quiz extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            count: JSON.parse(localStorage.getItem('count')) || 0,
            error:  null,
            ansdata: JSON.parse(localStorage.getItem('ansData')) || null,
            quesAnsData: JSON.parse(localStorage.getItem('quesData')) || null,
            isResult:JSON.parse(localStorage.getItem('isResult')) ||  false
        }

        this.selectans = []

    }

    handleLocalStorage = () => {
        let { count, ansdata, quesAnsData,isResult } = this.state
        localStorage.setItem('count', JSON.stringify(count))
        localStorage.setItem('ansData', JSON.stringify(ansdata))
        localStorage.setItem('quesData', JSON.stringify(quesAnsData))
        localStorage.setItem('isResult', JSON.stringify(isResult))

    }

    fetchQues = (id, difficulty) => {
        fetch(`https://opentdb.com/api.php?amount=10&category=${id}&difficulty=${difficulty}`)
            .then(res => res.json())
            .then(data => {
                this.setState({
                    quesAnsData: data.results,
                    ansdata: data.results
                },this.handleLocalStorage)
            })
    }

    componentDidMount() {
        let { id, difficulty } = this.props.quesData
        console.log(id,difficulty)
        if(id && difficulty){
            this.fetchQues(id, difficulty)
        }else{
            this.setState({
                questData: JSON.stringify(this.props.quesData) === '{}' ? this.state.quesAnsData : this.props.quesData,
                ansdata: JSON.stringify(this.props.quesData) === '{}' ? this.state.ansdata : this.props.quesData
            }, this.handleLocalStorage)
        }
    }

    handleAns = (event) => {
        let ans = event.target.innerText
        if (ans) {
            !this.selectans.includes(ans) ? this.selectans.push(ans)
                : this.selectans = this.selectans.filter(s => s !== ans)

            this.setState({
                error:null,
                ansdata: this.state.ansdata.map((d, i) => {
                    if (i === this.state.count) {
                        d['selectedAns'] = this.selectans
                    }
                    return d
                })
            },this.handleLocalStorage)
        }
    }

    handleNext = () => {
        if (this.selectans.length === 0) {
            this.setState({ error: "Please select atleast one option" },this.handleLocalStorage)
        } else {
            if (this.state.count < 9) {
                this.setState({ count: this.state.count + 1 },this.handleLocalStorage)
                this.selectans = []
            } else {
                this.setState({ isResult: true },this.handleLocalStorage)
            }
        }
    }

    handleRetake=()=>{
        localStorage.clear()
        this.setState({isResult:false,count:0})
    }

    render() {
        let { count, quesAnsData, error, isResult, ansdata } = this.state
        let options;
        if (quesAnsData) {
            let { correct_answer, incorrect_answers } = quesAnsData[count]
            options = [...incorrect_answers, correct_answer]
        }

        console.log(options)

        if (isResult) {
            return <Result result={ansdata} retake={this.handleRetake} />
        }

        return (
            <>
                {options && <div className="container">
                    <h1 className="font-20 margin-b-1">Question:{count + 1}/{quesAnsData.length}</h1>
                    <progress className="margin-b-2" value={10 * (count + 1)} max='100'></progress>
                    <h1 className="font-30 font-500">{quesAnsData[count].question}</h1>
                    <ul onClick={this.handleAns} className="quizOpt">
                        {options.map(option =>
                            <li className={this.selectans.includes(option)?'activeopt':''} key={option}>{option}</li>
                        )}
                    </ul>
                    {error && <p className="margin-1" style={{color:"tomato"}}>{error}</p>}
                    <div className="margin-1" style={{textAlign:"end"}}><button className="nextbtn font-20 font-600" onClick={this.handleNext}>Next</button></div>
                </div>
                }
            </>
        )
    }
}

function Result({result,retake}) {
    let score = 0
    return (
        <div className="tableDiv">
         <div className="flex between margin-1">
            <h1 className="font-30 font-600" style={{color:"tomato"}}>Result of the quiz.</h1>
         <button className="retakebtn font-25 font-600" onClick={retake}>ReTake Quiz</button>
         </div>
            <table>
                <thead>
                    <tr>
                        <th className='width-50'>Question</th>
                        <th>Correct answers</th>
                        <th>You selected</th>
                        <th>Right or Wrong</th>
                    </tr>
                </thead>
                <tbody>

                    {
                        result.map((q, i) => {
                            return (
                                <tr key={i}>
                                    <td className='width-60' style={{ fontSize: '1.4rem', letterSpacing: '1px' }}>{q.question}</td>
                                    <td>{q.correct_answer}</td>
                                    <td>{`${q.selectedAns}`}</td>
                                    <td style={{textAlign:"center"}}>{`${q.selectedAns}` === q.correct_answer ? ' ✔️' : ' ❌'}</td>
                                    {/* for increase score */}
                                    <td style={{ display: 'none' }}>{`${q.selectedAns}` === q.correct_answer ? score++ : ''}</td>
                                </tr>
                            )
                        })
                    }

                </tbody>
                <tfoot>
                    <tr>
                        <th>Total Correct</th>
                        <th className="">{score}</th>
                    </tr>
                </tfoot>
            </table>
        </div>
    )
}

export default Quiz