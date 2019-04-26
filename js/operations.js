var app = angular.module("questionBuilder", []);
app.controller("myCtrl", function($scope) {
    $scope.ritems = [];
    $scope.citems = [];
    $scope.images = ['images/circle-blue.png',
        'images/circle-green.png','images/circle-red.png','images/circle-yellow.png',
        'images/heart-blue.png','images/heart-green.png','images/heart-red.png','images/heart-yellow.png',
    'images/leaf.png','images/lego-blue.png','images/lego-green.png','images/lego-red.png','images/lego-yellow.png',
    'images/rect-blue.png','images/rect-green.png','images/rect-red.png','images/rect-yellow.png',
    'images/smiley.png','images/square-blue.png','images/square-green.png','images/square-red.png',
        'images/square-yellow.png','images/star.png','images/triangle-blue.png','images/triangle-green.png',
        'images/triangle-red.png','images/triangle-yellow.png'];
    $scope.choices = [{choice:'',answer:'',index:1}];
    $scope.rChoices = ['Default'];
    $scope.missedMultiSelectField = false;
    $scope.qsType = ['Select','Addition','Multiplication','Subtraction','Division'];
    $scope.choiceType = ['Select','Drag And Drop','Fill','Multi Select'];
    $scope.multiplicationType = ['Select','Vertical','Horizontal'];
    $scope.symbols = [{value:'&copy'},{value:'+'},{value:'='}];
    $scope.selectedColForSymbol = {};
    $scope.solutionVisibility = false;
    $scope.questionMetaData = {
        choiceTypeSelected:"Select",
        qsTypeSelected:"Select",
        multiplicationType:"Select",
        title:"",
        solutionType:""
    };
    $scope.solutionType = ['Model','Side By Side'];
    $scope.solutionContent = [];
    $scope.solutionCols = [];
    $scope.solutionRows = [];
    $scope.populateChoiceArray = function(){
        var choiceSelected = $scope.questionMetaData.choiceTypeSelected;
        if(choiceSelected == 'Multi Select'){
            if($scope.choices.length==0){
                alert('Please add atleast one choice');
                return;
            }
        };
        if(choiceSelected == 'Drag And Drop'){
            for(var i=0;i<$scope.ritems.length;i++){
                var colArray = $scope.ritems[i].cols;
                for(var x=0;x<colArray.length;x++){
                    if(colArray[x].checked == true){
                        var found = $scope.choices.find(function(element) {
                            return element.choice == colArray[x].value;
                        });
                        if(!found){
                            var isValueEmpty = $scope.choices.find(function(element) {
                                return element.choice == '';
                            });
                            if(isValueEmpty){
                                isValueEmpty.choice =colArray[x].value;
                            }else{
                                $scope.choices.push({choice:colArray[x].value,answer:''});
                            }

                        }
                    }
                }
            }

        };
    };
    $scope.getColumnData=function(colData,rowData){
        var colArray = [];
        for(var i=0;i<colData.length;i++){
            colArray.push({col1:i+"-"+rowData.length,value:'',checked:false});

        }
        return colArray;
    }
    $scope.addRow = function(){
        if($scope.citems.length == 0){
            $scope.citems.push({col1:$scope.citems.length+"-"+$scope.ritems.length,value:'',checked:false});

        }
        $scope.ritems.push({row1:$scope.ritems.length,
            hint:"",
            cols:$scope.getColumnData($scope.citems,$scope.ritems)});

    };
    $scope.addColumn = function(){
        $scope.citems.push({col1:$scope.citems.length+"-"+$scope.ritems.length,value:'',checked:false});
        for(var i=0;i<$scope.ritems.length;i++){
            $scope.ritems[i].cols.push({col1:$scope.citems.length+"-"+$scope.ritems[i].row1,value:'',checked:false})
        };
    }
    $scope.addChoice = function(){
        $scope.choices.push({choice:'',answer:'',index:999});
    };
    $scope.checkboxClick = function(val,idx){
        var found = $scope.ritems.find(function(element) {
            return element.row1 == val.row1;
        });
        var col = found.cols.find(function(ele){return ele.col1==idx.col1});
        col.checked=col.checked==true?false:true;
    };
    $scope.removeRow = function(obj,dataArray){
        var found = dataArray.findIndex(function(element) {
            return element.row1 == obj.row1;
        });
        dataArray.splice(found,1);
    };
    $scope.choiceVisibility = function(){
        var choiceSelected = $scope.questionMetaData.choiceTypeSelected;
        if((choiceSelected == 'Fill' )|| (choiceSelected == 'Select')){
            return false
        };
        return true;
    };
    $scope.validationCheck = function(){
        $scope.populateChoiceArray();
        $('#exampleModal').modal('show');
    };
    $scope.limitKeypress = function($event,value){
        if($scope.questionMetaData.multiplicationType == 'Vertical'){
            if (value != undefined && value.length>0) {
                $event.preventDefault();
            }
        }
    };
    $scope.addSolution = function(){
        $scope.solutionVisibility = true;
    };
    $scope.addSolutionLine = function(){
        $scope.solutionContent.push({value:""});
    };
    $scope.addSolutionRow = function(){
        if($scope.solutionCols.length == 0){
            $scope.solutionCols.push({col1:$scope.solutionCols.length+"-"+$scope.solutionRows.length,value:''});

        }
        $scope.solutionRows.push({row1:$scope.solutionRows.length,
            cols:$scope.getColumnData($scope.solutionCols,$scope.solutionRows)});
    };
    $scope.addSolutionCol = function(){
        $scope.solutionCols.push({col1:$scope.solutionCols.length+"-"+$scope.solutionRows.length,value:''});
        for(var i=0;i<$scope.solutionRows.length;i++){
            $scope.solutionRows[i].cols.push({col1:$scope.solutionCols.length+"-"+$scope.solutionRows[i].row1,value:'',})
        };
    }
    $scope.showSymbolModalPopup = function(col){
        $scope.selectedColForSymbol = col;
        $('#symbolModal').modal('show');
    };
    $scope.showIconModalPopup = function(){
        $('#iconModal').modal('show');
    };
    $scope.selectSymbol = function(val){
        $scope.selectedColForSymbol.value = val;
        $('#symbolModal').modal('hide');
    };
    $scope.insertImg = function(url){
        var x = document.createElement("IMG");
        x.setAttribute("src", url);
        document.getElementById("questionTitle").appendChild(x);
        $('#iconModal').modal('hide');
    };


    $scope.onSubmit = function(){
        $scope.populateChoiceArray();
        var dataObj = {
            "operation":$scope.questionMetaData.qsTypeSelected,
            "additionTypes":$scope.questionMetaData.multiplicationType,
            "questionName":$scope.questionMetaData.title,
            "questionContent":[],
            "choices":[],
            "choiceType":$scope.questionMetaData.choiceTypeSelected,
            "choiceCount":""};
        for(var x=0;x<$scope.ritems.length;x++){
            for(var y=0;y<$scope.ritems[x].cols.length;y++){
                dataObj.questionContent.push({
                    "row":x+1,
                    "col":y+1,
                    "value":$scope.ritems[x].cols[y].value,
                    "isMissed":$scope.ritems[x].cols[y].checked
                })
            };

        };
        for(var i=0;i<$scope.choices.length;i++){
            dataObj.choices.push($scope.choices[i].choice);
        };
        dataObj.choiceCount = dataObj.choices.length;
    };
    $scope.getDataTableStyle = function(){
        if($scope.questionMetaData.solutionType == 'Side By Side'){
            return{width:'30%',float:'left'}
        }else{
            return{width:'100%'}
        }

    }

})
