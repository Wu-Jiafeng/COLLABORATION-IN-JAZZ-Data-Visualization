  var width = 900;
  var height = 600;
  var tooltip = d3.select("body")//.select("#svgpic")
        .append("div")
        .attr("class","tooltip")
        .style("opacity",0.0);
  var svg = d3.select("body").select("#svgpic")
              .append("svg")
              .attr("width",width)
              .attr("height",height);
  function svgclear(){
    document.querySelector('svg').innerHTML = '';
  }

  function drawpic(){
    if(document.querySelector('svg').innerHTML!=''){
      alert("请先重置SVG画布！");
      return;
    }
    var alphaMin_value=document.paramter.alphaMin.value;
    var velocityDecay_value=document.paramter.velocityDecay.value;
    var DistanceForLink_value=document.paramter.DistanceForLink.value;
    var Strength_Charge_value=document.paramter.StrengthForForceCharge.value;
    var Strength_Collision_value=document.paramter.StrengthForForceCollision.value;
    var simulation = Simulation(null,alphaMin_set=alphaMin_value,velocityDecay_set=velocityDecay_value)
    .force("link", Link().id(function(d) { return d.id; }).distance(DistanceForLink_value))
    .force("charge", ManyBody().strength(Strength_Charge_value))
    .force("center", Center(width / 2, height / 2))
    .force("collide",Collide(function(d) { return 39*(d.value-1)/196+9; }).strength(Strength_Collision_value));

    d3.json("data.json", function(error, graph) {
      if (error) throw error;
      
      simulation.nodes(graph.nodes).on("tick", ticked);
      simulation.force("link").links(graph.links);

      var svg_links = svg.selectAll("line")
                          .data(graph.links)
                          .enter()
                          .append("line")
                          .style("stroke","#ccc")
                          .style("stroke-width",1)
                          .call(d3.zoom()//创建缩放行为
                          .scaleExtent([-5, 2])//设置缩放范围
                                );
      var svg_nodes = svg.selectAll("circle")
                          .data(graph.nodes)
                          .enter()
                          .append("circle")
                          .attr("id", function(d) { return d.id; })
                          .attr("out", function(d) { return d.out; })
                          .attr("cx", function(d) { return d.x; })
                          .attr("cy", function(d) { return d.y; })
                          .attr("r",function(d) { return (39*(d.value-1)/196+7).toString();})
                          .attr("fill", function(d){
                                return "rgb("+(-255*(d.value-1)/196+255)+",0,255)";
                        }).call(d3.drag().on("start", dragstarted)//d3.drag() 创建一个拖曳行为
                                        .on("drag", dragged)
                                        .on("end", dragended))
                          .on("mouseover", function(d){
                            if(d.id==(this).getAttribute('id')){
                              var idnum=parseInt((d.id).substr(4));
                              var outs=graph.nodes[idnum]["out"];
                              tooltip.html("id:"+d.id+";value:"+(d.value).toString())
                                    .style("left", (d3.event.pageX) + "px") 
                                    .style("top", (d3.event.pageY + 20) + "px")
                                    .style("opacity",1.0);
                              //svg.selectAll("text")
                              //  .attr("visibility",function(d){
                              //    if(parseInt((d.id).substr(4))==idnum){return "visible";}
                              //    //if(outs.indexOf(d.id)!=-1){return "visible";}
                              //    return "hidden";
                              //  });
                              svg.selectAll("circle")
                                .attr("fill",function(d){
                                  if(parseInt((d.id).substr(4))==idnum){return "rgb(0,0,255)";}
                                  if(outs.indexOf(d.id)!=-1){return "rgb(0,255,255)";}
                                  return "rgb("+(-255*(d.value-1)/196+255)+",0,255)";
                                });
                            }
                          })
                          .on("mousemove",function(d){  
                              tooltip.style("left", (d3.event.pageX) + "px")      
                                      .style("top", (d3.event.pageY + 20) + "px");
                              })
                          .on("mouseout",function(){
                              //svg.selectAll("text")
                              //  .attr("visibility","hidden");
                              tooltip.style("opacity",0);
                              svg.selectAll("circle")
                                .attr("fill",function(d){
                                  return "rgb("+(-255*(d.value-1)/196+255)+",0,255)";
                                });
                          });
      //添加描述节点的文字
      //var svg_texts = svg.selectAll("text")
      //    .data(graph.nodes)
      //    .enter()
      //    .append("text")
      //    .style("fill", "black") 
      //    .attr("dx", 20)
      //    .attr("dy", 8)
      //    .attr("visibility","hidden")
      //    .text(function(d){
      //       return d.id+":"+(d.value).toString();
      //    });

      function ticked() {
          svg_links.attr("x1", function(d) { return d.source.x; })
                    .attr("y1", function(d) { return d.source.y; })
                    .attr("x2", function(d) { return d.target.x; })
                    .attr("y2", function(d) { return d.target.y; });
 
          svg_nodes.attr("cx", function(d) { return d.x; })
                    .attr("cy", function(d) { return d.y; });
                     
       //   svg_texts.attr("dx", function(d){ return d.x; })
       //     .attr("dy", function(d){ return d.y; });
      }
  });
             
  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();//设置目标α
        d3.event.subject.fx = d3.event.subject.x;
        d3.event.subject.fy = d3.event.subject.y;
    }
 
  function dragged(d) {
    d3.event.subject.fx = d3.event.x;
    d3.event.subject.fy = d3.event.y;
  }
 
  function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
    d3.event.subject.fx = null;
    d3.event.subject.fy = null;
  }
}