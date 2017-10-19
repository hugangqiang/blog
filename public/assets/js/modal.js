let H = {
  modal: function(options){
      options = $.extend(true, {}, {
        title: "操作提示", //标题可以加HTML标签，加字体图标
        message: "提示内容", //内容，可以加HTML标签
        btnok: "确定", //确定按钮名字
        btncl: "取消", //取消按钮名字
        width: 300, //宽度，默认300
        timeOut: {    
          state: false,  //是否需要自动关闭
          time: 3000  //自动关闭时间
        },
        position: 'top',    //位置，默认top距离顶部，150, center ，水平垂直居中 
        clFn: function(){   //取消按钮所执行的事件，默认关闭

        },
        okFn: function(){  //成功按钮所执行的事件
          
        }
      }, options || {});

      let generateId = function () {
          let date = new Date();
          return 'mdl' + date.valueOf();
      };
      let modalId = generateId();

      let html = `<div class="modal fade" tabindex="-1" role="dialog" id="${modalId}">
                    <div class="modal-dialog" role="document">
                      <div class="modal-content">
                        <div class="modal-header">
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                          <h4 class="modal-title">${options.title}</h4>
                        </div>
                        <div class="modal-body">
                          ${options.message}
                          <span class="timeCl"></span>
                        </div>
                        <div class="modal-footer">
                          <button type="button" class="btn btn-default cl" data-dismiss="modal">${options.btncl}</button>
                          <button type="button" class="btn btn-primary ok">${options.btnok}</button>
                        </div>
                      </div>
                    </div>
                  </div>`;
      $('body').append(html);
      if(options.timeOut.state){
    	if(options.timeOut.time)
        $('#'+ modalId).find('.close,.cl,.ok').hide();
        setTimeout(function() {
            close();
        }, options.timeOut.time);
      }
      if(!options.btncl){
    	  $('#'+ modalId).find('.cl').hide();
      }
      $('#'+ modalId).css({
        opacity: 1,
        background: 'rgba(0,0,0,.6)'
      }).show();
      $('#'+ modalId).find('.modal-dialog').css({
        width: options.width
      });
      if(options.position == 'top'){
          $('#'+ modalId).find('.modal-dialog').css({
              top: '100px'
          },300)
      }
      if(options.position == 'center'){
          $('#'+ modalId).find('.modal-dialog').css({
              top: ($(window).height() - $('#'+ modalId).height())/2
          },300)
      }
     
      function close(){
        $('#'+ modalId).remove();
      }
      
      $('#'+ modalId).find('.close').on('click', close);

      $('#'+ modalId).find('.cl').on('click',function(){
          options.clFn();
          close();
      })
      $('#'+ modalId).find('.ok').on('click',function(){
          options.okFn();
          close();
      })
  }
};

