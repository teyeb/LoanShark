
/**
 * Get the values from the page
 * This is the controller function
 */
 function getValues(){

    //get values from the page
    let principalValue = document.getElementById("principalInput").value;
    let months = document.getElementById("termInput").value;
    let rate = document.getElementById("rateInput").value;
   
    

    
    try{
        principalValue = parseInt(principalValue);
        months = parseInt(months);
        rate = parseFloat(rate);


    //     console.log("principal: ", principalValue,", months: ",months,", rate: ",rate);
    // console.log("type of principal: ",typeof(principalValue),
    //             ", type of months: ",typeof(months),", type of rate: ",typeof(rate));

        if(!Number.isInteger(principalValue)|| !Number.isInteger(months)){
            return document.getElementById("results").innerHTML = 
            `<tr><strong class="alarm">Onlyx integers are permissible for the principal and payments(months) value<br><br></strong></tr>`;
        }
      
        const monthlyPayments = computeMonthlyPayments(principalValue, rate, months);

        
        // call generate numbers
        let values = generateNumbers(monthlyPayments,months, rate,principalValue); 
         //console.log(values)
        displayPaymentsSchedule(values);

        const finalRow = values[values.length-1];
        const totalInterest = finalRow[4];

        const totalCost = (parseFloat(principalValue) + parseFloat(totalInterest)).toFixed(2);

        displayMainNumbers(monthlyPayments,principalValue,totalInterest,totalCost);
    }
    catch(error){
        document.getElementById("results").innerHTML = 
        `<tr><strong>Onlyy integers are permissible<br><br><span style="color:red">${error.message}</span></strong></tr>`;
    }
    
}


const computeMonthlyPayments = (loan, rate, months) =>{
    return loan*(rate/1200.0)/(1.0 - Math.pow((1.0 + rate/1200.0),-1*months));
}

const displayMainNumbers = (monthlyPayments,loan,totalInterest,totalCost)=>{  
    document.getElementById("monthlyPayment").innerHTML = `$${monthlyPayments.toFixed(2)}`;
    document.getElementById("totalPrincipal").innerHTML = `$${loan}`;
    document.getElementById("totalInterest").innerHTML = `$${parseFloat(totalInterest).toFixed(2)}`;
    document.getElementById("totalCost").innerHTML = `$${totalCost}`;
}




/**
 * Generate Numbers from the start to end values
 * This is the logic/model function
 */
function generateNumbers(monthlyPayments,months,rate,loan){
    let values = [];//this will be an array of arrays

    let totalInterest = 0;
    let previousBalance = loan;

    for(let i=1; i<=months;i++){
        let row = [];

        const interestPayment = previousBalance*rate/1200;
        const principalPayment = monthlyPayments - interestPayment;

        totalInterest += interestPayment;
        previousBalance = previousBalance - principalPayment;

        row.push(i);
        row.push(monthlyPayments.toFixed(2));
        row.push(principalPayment.toFixed(2))
        row.push(interestPayment.toFixed(2));
        row.push(totalInterest.toFixed(2));
        row.push(previousBalance.toFixed(2));
        values.push(row);
    } 
    return values;
}







/**
 * Displays even numbers as bold
 * This is the view function
 */
function displayPaymentsSchedule(values){

    let table = document.getElementById("results"); 
        table.innerHTML = "";

   values.map(
       item =>{          
            //each item is actually an array
           table.innerHTML += `<tr>          
            <td>${item[0]}</td>
            <td>${item[1]}</td>
            <td>${item[2]}</td>
            <td>${item[3]}</td>
            <td>${item[4]}</td>
            <td>${item[5]}</td>
           </tr>`

           return
       }
   )
}