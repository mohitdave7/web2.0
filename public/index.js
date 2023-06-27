class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      amount: 1000,
      total_amount : 2000,
      email:'a@gmail.com'
    }
  }
  async componentDidMount() {
    const result = await axios.get('/get_info');
    console.log(result)
    this.setState({total_amount:result.data[0]?.total_amount})
  }
  onSubmit=async(e)=>{
    e.preventDefault();
    const reponse = await axios.post('/post_info',{
      amount : this.state.amount,
      email : this.state.email
    });
    console.log(reponse);
  }
  render() {
    return (
      <div>
        <h1>LOTTERY APPLICATION WEB 2.0</h1>
        <div><p>Total lottery amount is {this.state.total_amount}</p></div>
        <div>
          <form onSubmit={this.onSubmit}>
            <div>
              <input placeholder="amount" value={this.state.amount} onChange={(e)=>this.setState({amount:e.target.value})}/>
            </div>
            <div>
                <input placeholder="email" value={this.state.email} onChange={(e)=>this.setState({email:e.target.value})}/>
            </div>   
            <div> <button type='submit'>participate</button></div>
    
          </form>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('reactBinding'));
