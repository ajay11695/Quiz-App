
import React from "react"
import { Link } from "react-router-dom"

let Categories = ['All', 'General', 'Entertainment', 'Science', 'Mythology', 'Sports', 'Geography',
    'History', 'Politics', 'Art', 'Celebrities', 'Animals', 'Vehicles']


class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            category: 'All',
            difficulty: 'easy',
            categories: null
        }
    }

    componentDidMount() {
        this.fetchCategory()
    }

    fetchCategory = () => {
        fetch('https://opentdb.com/api_category.php').then(res => res.json())
            .then((data) => {
                let catData = data.trivia_categories.filter((c) => {
                    if (this.state.category === 'All') {
                        return c
                    }
                    if (c.name.includes(this.state.category)) {
                        return c
                    }
                    return ''
                })
                return this.setState({
                    categories: catData
                })
            })
    }

    handleCategory = (event) => {
        this.setState({ category: event.target.value })
        this.fetchCategory()
    }

    handleDifficulty = (event) => {
        this.setState({ difficulty: event.target.value })

    }

    render() {
        return (
            <main className="flex padding">
                <aside className="flex-30">
                    <h1 className="textalign font-25 margin-b-2">Select Category & Difficulty</h1>
                    <div className="flex column ">
                        <label className="font-20 margin-b-1">Quiz Categories</label>
                        <select className="margin-b-2" name="category" onChange={this.handleCategory}>
                            {Categories.map(category =>
                                <option key={category} value={category}>{category}</option>
                            )}
                        </select>
                        <label className="font-20 margin-b-1" htmlFor="level">Difficulty:</label>
                        <select name='lebel' className="margin-b-2" onChange={this.handleDifficulty}>
                            <option value='easy'>Easy</option>
                            <option value='medium'>Medium</option>
                            <option value='hard'>Hard</option>
                        </select>
                    </div>
                </aside>
                <div className="flex-70">
                    <h1 className="font-30 font-700">Top Quiz</h1>
                    <hr/>
                    <Card catdata={this.state.categories} takeQuiz={this.props.takeQuiz} difficulty={this.state.difficulty} />
                </div>
            </main>
        )
    }
}

function Card(props) {
    let { catdata, takeQuiz, difficulty } = props
    if (!catdata) {
        return <p>Loading...</p>
    }
    return (
        <ul className="flex wrap evenly">
            {
                catdata.map((cat) =>
                    <li key={cat.name} className="flex card">
                        <figure className="">
                            <img src='https://st.depositphotos.com/1032577/4119/i/600/depositphotos_41197145-stock-photo-quiz.jpg' alt='quiz' />
                        </figure>
                        <div className="padding-1">
                            <p className="font-25 font-600 margin-b-2">{cat.name}</p>
                            <p className="quizbtn"><Link to='/quiz' onClick={() => { takeQuiz(cat.id, difficulty) }}>Take this quiz</Link></p>
                        </div>
                    </li>
                )
            }
        </ul>
    )
}

export default Home