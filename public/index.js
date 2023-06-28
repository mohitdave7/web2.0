const logo1 = './images/first.png';
const logo2 = './images/second.jpeg';
const logo3 = './images/third.jpeg';
const logo4 = './images/fourth.jpeg';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 1000,
      total_amount: 2000,
      email: 'a@gmail.com',
      error: null
    };
  }

  async componentDidMount() {
    const result = await axios.get('/get_info');
    console.log(result);
    this.setState({ total_amount: result.data[0]?.total_amount });
  }

  onSubmit = async (e) => {
    e.preventDefault();
    console.log("inclick");

    if (this.state.amount <= 1) {
      this.setState({ error: 'Amount must be greater than one' });
      return;
    }

    const response = await axios.post('/post_info', {
      amount: this.state.amount,
      email: this.state.email
    });
    window.location.href = response.data;
  }

  render() {
    return (
      <div className="container">
        <div className="logo-container">
          <img src={logo1} alt="Logo" className="logo" />
        </div>
        <h1 className="lottery-font">LOTTERY APPLICATION WEB 2.0</h1>
        <div className="marquee-container">
          <div className="marquee">
            <p className="marquee-text">Welcome to the Lottery Application!</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title text-center">Total Winning Pool</h5>
            <div className="d-flex justify-content-center align-items-center bg-primary rounded-circle mx-auto w-50 h-50 mt-3">
              <p className="text-white fs-3 fw-bold m-0">${this.state.total_amount}</p>
            </div>
            <form onSubmit={this.onSubmit}>
              <div className="mb-3 mt-4">
                <input
                  className="form-control"
                  type="number"
                  min="1"
                  placeholder="Enter Amount"
                  value={this.state.amount}
                  onChange={(e) => this.setState({ amount: e.target.value, error: null })}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  className="form-control"
                  type="email"
                  placeholder="Enter Email"
                  value={this.state.email}
                  onChange={(e) => this.setState({ email: e.target.value })}
                  required
                />
              </div>
              {this.state.error && (
                <div className="alert alert-danger">{this.state.error}</div>
              )}
              <div className="text-center">
                <button className="btn btn-primary" type="submit">Participate</button>
              </div>
            </form>
          </div>
        </div>
        <div className="lottery-logos">
          <img src={logo2} alt="Logo 2" className="logo" />
          <img src={logo3} alt="Logo 3" className="logo" />
          <img src={logo4} alt="Logo 4" className="logo" />
        </div>
      </div>
    );
  }
}


ReactDOM.render(<App />, document.getElementById('reactBinding'));
