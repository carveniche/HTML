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
    $scope.questionMetaData = {
        choiceTypeSelected:"Select",
        qsTypeSelected:"Select",
        multiplicationType:"Select",
        title:""
    };


    $scope.getColumnData=function(){
        var colArray = [];
        for(var i=0;i<$scope.citems.length;i++){
            colArray.push({col1:i+"-"+$scope.ritems.length,value:'',checked:false});

        }
        return colArray;
    }
    $scope.addRow = function(){
        if($scope.citems.length == 0){
            $scope.citems.push({col1:$scope.citems.length+"-"+$scope.ritems.length,value:'',checked:false});

        }
        $scope.ritems.push({row1:$scope.ritems.length,
            hint:"",
            cols:$scope.getColumnData()});

    };
    $scope.addColumn = function(){
        $scope.citems.push({col1:$scope.citems.length+"-"+$scope.ritems.length,value:'',checked:false});
        for(var i=0;i<$scope.ritems.length;i++){
            $scope.ritems[i].cols.push({col1:$scope.citems.length+"-"+$scope.ritems[i].row1,value:'',checked:false})
        }


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
    $scope.removeRow = function(obj){
        var found = $scope.ritems.findIndex(function(element) {
            return element.row1 == obj.row1;
        });
        $scope.ritems.splice(found,1);
    };
    $scope.choiceVisibility = function(){
        var choiceSelected = $scope.questionMetaData.choiceTypeSelected;
        if((choiceSelected == 'Fill' )|| (choiceSelected == 'Select')){
            return false
        };
        return true;
    };
    $scope.validationCheck = function(){
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
                        if(!found)
                        $scope.choices.push({choice:colArray[x].value,answer:''});
                    }
                }
            }

        };
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

    };
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
        x.setAttribute("width", "40");
        x.setAttribute("height", "40");
        document.getElementById("testing").appendChild(x);
        $('#iconModal').modal('hide');
    }

})
