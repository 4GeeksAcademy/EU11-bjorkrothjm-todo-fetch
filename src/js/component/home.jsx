import React, { useState, useEffect } from 'react';

//include images into your bundle
//import rigoImage from "../../img/rigo-baby.jpg";

//create your first component
const Home = () => {
	const [inputValue, setInputValue] = useState(null);
	const [todoArray, setTodoArray] = useState(["No tasks, add a task"]);
	const [taskArray, setTaskList] = useState([])

	const createUser = () =>{
		console.log("RUNNING createUser")
		fetch('https://assets.breatheco.de/apis/fake/todos/user/swedishchef', {
		method: "POST",
		body: JSON.stringify([]), // [] / Array becasue we want to send an emptry array 
		headers: { 
			"Content-Type": "application/json"
		}
		})
		.then(resp => {
			console.log(resp.ok); // will be true if the response is successfull
			console.log(resp.status); // the status code = 200 or code = 400 etc.
			console.log(resp.text()); // will try return the exact result as string
		})
		.catch(error => {
			//error handling
			console.log(error);
		});
	}
	
	useEffect(() => {
		console.log("useEffect starting")
		setupUser()
		console.log("useEffect ending")

		async function setupUser() {

			//getUser()
			console.log("Trying to call getUser and put response into getUserResponse")
			const getUserResponse = await getUser()
			console.log("getUserResponse", getUserResponse);
			
			// if output from getUser() === error ->  createUser()
			if (getUserResponse === "TypeError"){
				createUser()
			} else{
				const userData = getUserResponse
				setTaskList(userData)
				console.log(taskArray)
			}
		};

		async function getUser() {
			await fetch('https://assets.breatheco.de/apis/fake/todos/user/swedishchef', {
				method: "GET",
				//body: JSON.stringify(), // no body becasue we are not sending any data
				headers: {
					"Content-type": "application/json"
				}
			})
			// then: returns a promise + can take up to 2 arguments
			.then(resp => {
				console.log(resp.ok) // will be true if the response is successfull
				console.log(resp.status) // the status code = 200 or code = 400 etc.
				console.log(resp.text()); // will try return the exact result as string
				return resp.json(); // (returns promise) will try to parse the result as json as return a promise that you can .then for results
			})
			.then(data => {
				//here is where your code should start after the fetch finishes
				console.log(data); //this will print on the console the exact object received from the server
				return data
			})
			.catch(error => {
				// error handling
				console.log(error)
				console.log(error.name)
				return error.name
			});
		};

	}, []);  // ADDING AN EMPTY ARRAY [] AS A SECOND ARGUMENT TO MAKE useEffect RUN ONLY AFTER FIRST RENDER -> THIS IS A DEPENDENCY ARRAY: useEffect(setup, dependencies?)

	const handleKeyDown = (event) => {
		console.log(event.key);
		if (event.key === "Enter"){
			todoArray[0] === "No tasks, add a task"
				? setTodoArray(todoArray.concat(inputValue).slice(1,todoArray.length+1))
				: setTodoArray(todoArray.concat(inputValue))
			
			// // Same as above (without checking first array item)
			// setTodoArray(previousState => {
			// 	return previousState.concat(inputValue);
			// })
			setInputValue("");
		};	
	};
	const removeItem = (index) => {
		console.log(todoArray, index);
		//todoArray.splice(index, 1) does not work to manipulate the state
		// need to use Filter - to filer out (=return) values 
		const updatedTodo = todoArray.filter((_, i) => i !== index);
		setTodoArray(updatedTodo);
	}


	const temporary = () => {
		fetch('https://assets.breatheco.de/apis/fake/todos/user/swedish-chef', {
		method: "POST",
		body: JSON.stringify(todos),
		headers: {
			"Content-Type": "application/json"
		}
		})
		.then(resp => {
			console.log(resp.ok); // will be true if the response is successfull
			console.log(resp.status); // the status code = 200 or code = 400 etc.
			console.log(resp.text()); // will try return the exact result as string
			return resp.json(); // (returns promise) will try to parse the result as json as return a promise that you can .then for results
		})
		.then(data => {
			//here is where your code should start after the fetch finishes
			console.log(data); //this will print on the console the exact object received from the server
		})
		.catch(error => {
			//error handling
			console.log(error);
		});
	}

	return (
		<div>
			<h1 className="text-center">todos</h1>
			<div className="d-flex justify-content-center">
				<ul className="list-group w-50">
					<input className="list-style" type="text" onChange={e => setInputValue(e.target.value)} value={inputValue} onKeyDown={handleKeyDown} placeholder="What needs to be done?"/>
					{todoArray.map( (item, index) => {
						return <li className="list-group-item list-style" key={index}>{item} <button onClick={() => removeItem(index)}>x</button> </li>
					})
					}
					<li className="list-group-item list-style task-counter">{todoArray.length} items left</li>
					<li className="list-group-item list-style" id="button-li"><button id="remove-all-btn" onClick={() => {}}>Remove all todos</button></li>
				</ul>
			</div>
		</div>
	)
};

export default Home;