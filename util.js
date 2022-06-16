function solveFormula(formula,selfCellObject){
    // formula= (A1 + B2 + 2 - C3)
    let formulaComps=formula.split(" ");
    for(let i=0;i<formulaComps.length;i+=1){
        let formulaComp=formulaComps[i];
        if(formulaComp[0]>='A' && formulaComp[0]<='Z'){
            let {rowId,colId}=getRodIdColIdFromAddress(formulaComp);
            let cellObject=db[rowId][colId];
            let value=cellObject.value;
            //-----------> adding last selected cell in array of formula nodes as child
            if(selfCellObject){
                cellObject.children.push(selfCellObject.name);
                selfCellObject.parent.push(cellObject.name);
            }
                
            // console.log(cellObject);
            console.log(cellObject);
            formula=formula.replace(formulaComp,value);
        }
    }
    // formula --> 2 *  3 + 4 - 3
    let computedValue=eval(formula); // eval perfroms infix operation just like stack
    return computedValue;
}

function updateChildren(cellObject){
    for(let i=0;i<cellObject.children.length;i+=1){
        let childName=cellObject.children[i];
        let {rowId,colId}=getRodIdColIdFromAddress(childName);
        let childCellObject=db[rowId][colId];
        let newValue=solveFormula(childCellObject.formula);
        // update UI
        let cellUI=document.querySelector(`div[rowid='${rowId}'][colid='${colId}']`);
        cellUI.textContent=newValue;
        // update db
        childCellObject.value=newValue;
        updateChildren(childCellObject);
    }
}

function removeFormula(cellObject){
    for(let i=0;i<cellObject.parent.length;i+=1){
        let parentName=cellObject.parent[i];
        let {rowId,colId}=getRodIdColIdFromAddress(parentName);
        let parentCellObject=db[rowId][colId];
        let updatedChildren=parentCellObject.children.filter(function(child){
            return child!=cellObject.name;
        })
        parentCellObject.children=updatedChildren;
        console.log(updateChildren);
    }
     cellObject.parent=[];
}


function getRodIdColIdFromAddress(address){
    // address = A1,B2
    let colId=address.charCodeAt(0)-65;
    let rowId=Number(address.substring(1))-1;
    return{
        rowId,
        colId
    }
}


function getRowIdColIdFromElement(element){
    let rowId=element.getAttribute('rowid');
    let colId=element.getAttribute('colid');
    // here object is return with key rowid and colid with value corressponding to their value
    return {
        rowId,colId
    };
}
