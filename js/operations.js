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
    $scope.title = '';
    $scope.submitBtnDisabled = true;
    $scope.questionMetaData = {
        choiceTypeSelected:"Select",
        qsTypeSelected:"Select",
        multiplicationType:"Select",
        title:"",
        solutionType:""
    };
    $scope.solutionType = ['Select','Model','Side By Side'];
    $scope.solutionContent = [];
    $scope.solutionCols = [];
    $scope.solutionRows = [];
    $scope.selectedElementForIcon = '';
    $scope.solutionArray = [{solutionType:'Select',solutionContent:[],solutionRows:[],solutionCols:[]}];
    $scope.dataObj = {};
    $scope.questionTitleContents = [];
    $scope.showModelSolutionContent = false;
    $scope.showSidebysideSolutionContent = false;

    $scope.createFinalDataObj = function(){

        $scope.dataObj = {
            "modelSolutionContent":{},
            "sidebysideSolutionContent":{},
            "operation":$scope.questionMetaData.qsTypeSelected,
            "additionTypes":$scope.questionMetaData.multiplicationType,
            "questionName":"<img src=\'images/circle-blue.png\'>",//document.getElementById("questionTitle").innerHTML,
            "questionContent":[],
            "choices":[],
            "choiceType":$scope.questionMetaData.choiceTypeSelected,
            "choiceCount":""};
        for(var x=0;x<$scope.ritems.length;x++){
            for(var y=0;y<$scope.ritems[x].cols.length;y++){
                $scope.dataObj.questionContent.push({
                    "row":x+1,
                    "col":y+1,
                    "value":$scope.ritems[x].cols[y].value,
                    "isMissed":$scope.ritems[x].cols[y].checked
                })
            };

        };

        $scope.solutionArray.forEach(function(obj){
            if(obj.solutionType == 'Model'){
                $scope.dataObj.modelSolutionContent = obj;

            }else if(obj.solutionType == 'Side By Side'){
                $scope.dataObj.sidebysideSolutionContent = obj;
            }
        });
        $scope.creatingModelSolution();

    };
    $scope.populateChoiceArray = function(){
        var choiceSelected = $scope.questionMetaData.choiceTypeSelected;

        if(choiceSelected!='Fill'){
            if(choiceSelected == 'Multi Select'){
                if($scope.choices.length==1 && $scope.choices[0].choice==''){
                    alert('Please add atleast one choice');
                    return false;
                }
            };
            var duplicates = []
            $scope.choices.forEach(function(val){
                if(!duplicates.includes(val.choice)){
                    duplicates.push(val.choice);
                }
            });
            if(duplicates.length != $scope.choices.length){
                alert('Please remove duplicate choices');
                return false;
            };
            /*for(var i=0;i<$scope.ritems.length;i++){
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
                                isValueEmpty.answer = true;
                            }else{
                                $scope.choices.push({choice:colArray[x].value,answer:true});

                            }

                        }
                    }
                }
            };*/
            for(var i=0;i<$scope.choices.length;i++){
                $scope.dataObj.choices.push($scope.choices[i].choice);
            };

            $scope.dataObj.choiceCount = $scope.dataObj.choices.length;
        };


        return true;
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
            $scope.citems.push({col1:$scope.citems.length+"-"+$scope.ritems.length,value:'',checked:false,answer:""});

        }
        $scope.ritems.push({row1:$scope.ritems.length,
            hint:"",
            cols:$scope.getColumnData($scope.citems,$scope.ritems)});

    };
    $scope.addColumn = function(){
        $scope.citems.push({col1:$scope.citems.length+"-"+$scope.ritems.length,value:'',checked:false,answer:""});
        for(var i=0;i<$scope.ritems.length;i++){
            $scope.ritems[i].cols.push({col1:$scope.citems.length+"-"+$scope.ritems[i].row1,value:'',checked:false,answer:""})
        };
    };
    $scope.addChoice = function(){
        $scope.choices.push({choice:'',answer:'',index:999});
    };
    $scope.checkboxClick = function(val,idx){
        var obj = idx;
        var choiceSelected = $scope.questionMetaData.choiceTypeSelected;
        if(choiceSelected == 'Multi Select'){
            $scope.ritems.forEach(function(row){
                    row.cols.forEach(function(col){
                        if(col.col1 != obj.col1){
                            col.checked = false;
                            var idx = $scope.choices.findIndex(function(element) {
                                return (col.value == element.choice && element.answer == true);
                            });
                            if(idx != -1)
                                $scope.choices.splice(idx,1);
                        }

                    })
            })
        }
        var found = $scope.ritems.find(function(element) {
            return element.row1 == val.row1;
        });
        var col = found.cols.find(function(ele){return ele.col1==idx.col1});
        col.checked=col.checked==true?false:true;
        if(col.checked){
            var isValueEmpty = $scope.choices.find(function(element) {
                return element.choice == '';
            });

            if(isValueEmpty){
                isValueEmpty.choice = col.value;
                isValueEmpty.answer = true;
            }else{
                $scope.choices.push({choice:col.value,answer:true,index:999});
            }
        }else{
            var idx = $scope.choices.findIndex(function(element) {
                return (col.value == element.choice && element.answer == true);
            });
            if(idx != -1){
                if($scope.choices[idx].index ==1){
                    $scope.choices[idx].choice="";
                    $scope.choices[idx].answer =false;
                }else{
                    $scope.choices.splice(idx,1);
                }
            }

        };

    };
    $scope.removeRow = function(obj,dataArray){
        var found = dataArray.findIndex(function(element) {
            return element.row1 == obj.row1;
        });
        if(dataArray.length==1){
            $scope.citems = [];
        };
        dataArray.splice(found,1);
    };
    $scope.choiceVisibility = function(){
        var choiceSelected = $scope.questionMetaData.choiceTypeSelected;
        if((choiceSelected == 'Fill' )|| (choiceSelected == 'Select')){
            return false
        };
        return true;
    };
    $scope.appendQuesTitle = function(){
        var titleBody = '<span>';
        titleBody += $scope.questionMetaData.title;
        titleBody += '</span>';
        $('#exampleModalLabel').html(titleBody);
    };
    $scope.validationCheck = function(){

        $scope.dataObj = {};
        $scope.questionMetaData.title = $("#questionTitle").html();

        var choiceSelected = $scope.questionMetaData.choiceTypeSelected;
        $scope.createFinalDataObj();
        var missedElements = [];
        //Validating the data
        $scope.dataObj.questionContent.forEach(function(element) {
            if (element.isMissed == true){
                missedElements.push(element.value);
            };
        });
        if($scope.questionMetaData.qsTypeSelected == '' || $scope.questionMetaData.qsTypeSelected == 'Select'){
            alert('Please select Question Type');
            return;
        };
        if($scope.questionMetaData.multiplicationType == '' || $scope.questionMetaData.multiplicationType == 'Select'){
            alert('Please select Multiplication Type');
            return;
        };
        if(choiceSelected == '' || choiceSelected == 'Select'){
            alert('Please Select Choice Type');
            return;
        };

        if(missedElements.length==0){
            alert('Please select atleast one value as missed');
            return;
        };
        var choiceRepeated = false;
        $scope.choices.forEach(function(element){
            var x = missedElements.includes(element.choice);
           /* if(x){
                alert('Please do not add missed value as choice');
                choiceRepeated =true;
                return;
            };*/

        });
        if(!choiceRepeated){
            var status = $scope.populateChoiceArray();
            if(status){
                $scope.appendQuesTitle();
                if(choiceSelected == 'Drag And Drop')
                $scope.addDragableEements();
                $('#exampleModal').modal('show');

            }
        };

    };
    $scope.limitKeypress = function($event,obj,row,sol,id){
        var regex = new RegExp("^[a-zA-a]+$");
        var str = String.fromCharCode(!$event.charCode ? $event.which : $event.charCode);
        if(!sol){
            if (regex.test(str)) {
                $event.preventDefault();
                return false;
            }else if($scope.questionMetaData.multiplicationType == 'Vertical'){

                if (obj.value != undefined && obj.value.length>0) {
                    $event.preventDefault();
                    return false;
                }
            };
        }


        if(sol){
            if(sol.solutionType == 'Side By Side'){
                $scope.solutionArray.forEach(function(elem){
                    if(elem.solutionType == sol.solutionType){
                        elem.solutionRows.forEach(function(elemrow){
                            if(elemrow.row1 == row.row1){
                                elemrow.cols.forEach(function(elemcol){
                                    if(elemcol.col1 == obj.col1){
                                        elemcol.value = str;
                                        elemcol.type='text';
                                    }
                                })
                            }

                        })
                    }
                })
            }
            else if(sol.solutionType == 'Model'){
                $scope.solutionArray.forEach(function(elem){
                    if(elem.solutionType == sol.solutionType){
                        elem.solutionContent.forEach(function(data){
                            if(data.line == obj.line ){
                                data.value =  $("#"+id).html();
                            }
                        })
                    }})
            }

        }



    };
    $scope.addSolution = function(){
        $scope.solutionVisibility = true;
    };
    $scope.addSolutionLine = function(obj,idx){
       obj.solutionContent.push({value:"",line: obj.solutionContent.length});
    };
    $scope.addSolutionRow = function(obj){
        if(obj.solutionCols.length == 0){
            obj.solutionCols.push({col1:obj.solutionCols.length+"-"+obj.solutionRows.length,value:''});

        }
        obj.solutionRows.push({row1:obj.solutionRows.length,
            cols:$scope.getColumnData(obj.solutionCols,obj.solutionRows)});
    };
    $scope.addSolutionCol = function(obj){
        obj.solutionCols.push({col1:obj.solutionCols.length+"-"+obj.solutionRows.length,value:''});
        for(var i=0;i<obj.solutionRows.length;i++){
            obj.solutionRows[i].cols.push({col1:obj.solutionCols.length+"-"+obj.solutionRows[i].row1,value:'',})
        };
    };
    $scope.showSymbolModalPopup = function(col,type,id,row){
        col.type = type;
        col.row=row;
        col.id=id;
        $scope.selectedColForSymbol = col;
        $('#symbolModal').modal('show');
    };
    $scope.showIconModalPopup = function(elemId,col,type,row){
        if(col){
            col.type = type;
            col.row=row;
            col.id=elemId;
            $scope.selectedElementForIcon = col;
        }else{
            $scope.selectedElementForIcon = {};
            $scope.selectedElementForIcon.id = elemId;
        }

        $('#iconModal').modal('show');
    };
    $scope.selectSymbol = function(val){
        if($scope.selectedColForSymbol.type == 'M'){
            $scope.solutionArray.forEach(function(elem){
                if(elem.solutionType == 'Model'){
                    elem.solutionContent.forEach(function(data){
                        if(data.line == $scope.selectedColForSymbol.line ){
                            var str = $("#line"+$scope.selectedColForSymbol.line).html()+val;
                            data.value =  str;
                            var e = document.getElementById('line'+$scope.selectedColForSymbol.line);
                            e.innerHTML = str;
                        }
                    })
                }})
        }else if($scope.selectedColForSymbol.type == 'S'){
            $scope.solutionArray.forEach(function(elem){
                if(elem.solutionType == 'Side By Side'){
                    elem.solutionRows.forEach(function(elemrow){
                        if(elemrow.row1 == $scope.selectedColForSymbol.row){
                            elemrow.cols.forEach(function(elemcol){
                                if(elemcol.col1 == $scope.selectedColForSymbol.col1){
                                    var str = $("#"+$scope.selectedColForSymbol.id).html()+val;
                                    elemcol.value = str;
                                    var e = document.getElementById($scope.selectedColForSymbol.id);
                                    e.innerHTML = str;
                                }
                            })
                        }

                    })
                }
            })
        }
        $scope.selectedColForSymbol.value = val;
        $('#symbolModal').modal('hide');
    };
    $scope.insertImg = function(url){
        var x = document.createElement("IMG");
        x.setAttribute("src", url);
        x.setAttribute("width", '25px');
        x.setAttribute("height", '25px');
        document.getElementById($scope.selectedElementForIcon.id).appendChild(x);

        if($scope.selectedElementForIcon.type == 'S'){
            $scope.solutionArray.forEach(function(elem){
                if(elem.solutionType == 'Side By Side'){
                    elem.solutionRows.forEach(function(elemrow){
                        if(elemrow.row1 == $scope.selectedElementForIcon.row){
                            elemrow.cols.forEach(function(elemcol){
                                if(elemcol.col1 == $scope.selectedElementForIcon.col1){
                                    elemcol.value = url;
                                    elemcol.type = 'img';
                                }
                            })
                        }

                    })
                }
            })
        }else if($scope.selectedElementForIcon.type == 'M'){
            $scope.solutionArray.forEach(function(elem){
                if(elem.solutionType == 'Model'){
                    elem.solutionContent.forEach(function(data){
                        if(data.line == $scope.selectedElementForIcon.line ){
                            var str = $("#line"+$scope.selectedElementForIcon.line).html();
                            data.value =  str;
                        }
                    })
                }})
        }

        $('#iconModal').modal('hide');
    };
    $scope.onSubmit = function(){
    };
    $scope.getDataTableStyle = function(){
        if($scope.dataObj&&
            $scope.dataObj.sidebysideSolutionContent
            &&
            $scope.dataObj.sidebysideSolutionContent.solutionType == 'Side By Side'){
            return{width:'30%',float:'left'}
        }else{
            return{width:'100%'}
        }
    };
    $scope.addMoreSolution = function(){
        $scope.solutionArray.push({solutionType:'Select',solutionContent:[],solutionRows:[],solutionCols:[]});
    };
    $scope.removeChoice = function(obj){
        var found = $scope.choices.findIndex(function(element) {
            return (element.choice == obj.choice && element.answer == obj.answer);
        });
        $scope.choices.splice(found,1);
    };
    $scope.creatingModelSolution = function(){
        if($scope.dataObj.modelSolutionContent){
            if($scope.dataObj.modelSolutionContent.solutionContent){
                var data = $scope.dataObj.modelSolutionContent.solutionContent;
                var table_body = '<table style="margin:0 auto;width:50%">';
                for(var i=0;i<data.length;i++){
                    table_body+='<tr>';
                        table_body +='<td>';
                        table_body += data[i].value;
                        table_body +='</td>';
                    table_body+='</tr>';
                }
                table_body+='</table>';
                $('#modelSolutionContent').html(table_body);
            }
        }
    };
    $scope.addDragableEements = function(){
        $scope.choices.forEach(function(ob){
            //$("#choice"+ob.choice).draggable()gab
            $(".dummy").draggable();
            $(".dummy").draggable({
                revert: "invalid",
                helper: "clone",
            });
        });

        $scope.ritems.forEach(function(row){
            row.cols.forEach(function(col){
                if(col.checked == true){
                    $( "#data"+col.value ).droppable({
                        activeClass: "ui-state-default",
                        hoverClass: "ui-state-hover",
                        drop: function( event, ui ) {
                            $(this).empty();
                            ui.draggable.clone().appendTo($(this));
                            var val = $(ui.draggable).attr("id");
                            col.answer = document.getElementById(val).innerHTML;

                        }
                    })
                }
            })
        })

    };
    $scope.choiceSelected = function(ch){
        ch.selected = ch.choice;
        if( $scope.questionMetaData.choiceTypeSelected == 'Multi Select'){
            $scope.ritems.forEach(function(row){
                row.cols.forEach(function(col){
                    if(col.checked == true){
                        col.answer = ch.choice;
                    }
                })
            })
        };
        $scope.choices.forEach(function(ob){
            var classValid = $('#choice'+ob.choice).hasClass("choiceSelected");
            if(classValid){
                $('#choice'+ob.choice).removeClass("choiceSelected");
            };
        })
        $('#choice'+ch.choice).addClass('choiceSelected');
    };
    $scope.removeCol = function(idx){
        $scope.ritems.forEach(function(row){
            row.cols.splice(idx,1);
        });
        $scope.citems.splice(idx,1);
    };
    $scope.verifyTheAnswer = function(){
        var verified = true;
        var wrongAns = [];
        var emptyAns = [];
        $scope.ritems.forEach(function(row){
            row.cols.forEach(function(col){
                if(col.checked == true){
                    if(col.answer == ""){
                        emptyAns.push(true);
                    }
                    if(col.answer != col.value){
                        wrongAns.push(col.answer);
                    };
                }
            });


        });
        if(emptyAns.length>0){
            alert('Please enter values in empty box');
        }
        else if(wrongAns.length>0){
            alert('Entered Value is incorrect');
            $scope.showModelSolutionContent = true;
            $scope.showSidebysideSolutionContent =true;

        }else{
            $scope.submitBtnDisabled = false;
        }
    };
    $scope.previewKeyPress = function($event){
        var regex = new RegExp("^[a-zA-a]+$");
        var str = String.fromCharCode(!$event.charCode ? $event.which : $event.charCode);
        if (regex.test(str)) {
            $event.preventDefault();
            return false;
        };
        return true;
    };
    $scope.removeSolutionLine = function(arg1,arg2){
        if(arg2.solutionType == 'Model'){
            var idx= arg2.solutionContent.findIndex(function(elem){
                return (elem.line == arg1.line)
            });
            if(idx!= -1){
                arg2.solutionContent.splice(idx,1)
            }
        }
            var x = 'fsf';
    };
    $scope.disableAddCol = function(){
        if($scope.ritems.length>0){
            return false;
        };
        return true;
    }


})
