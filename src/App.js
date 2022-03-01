
import logo from './logo.svg';
import './App.css';
import './bootstrap.css';
function App() {
	var pomanderCount = [0,0,0,0,0,0,5,3,0,0,0,0,0,0,0,0];
  return (
	<>
        <div class="container">
		  {[0,1,2].map((count)=>
			<div class="row">{
			  [0+count*6,1+count*6,2+count*6,3+count*6,4+count*6,5+count*6].map((num)=>
			<div class="col">
			{pomanderCount[num]}
			</div>
			)}
			</div>)
		  }
		</div>
    </>
  );
}

export default App;
