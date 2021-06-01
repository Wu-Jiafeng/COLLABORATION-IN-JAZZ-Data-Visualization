import json
filename=r'D:\学校\课程\专业课\可视化与可视计算概论\作业\作业2\data.json'
inputfile=r'D:\学校\课程\专业课\可视化与可视计算概论\作业\作业2\data.txt'

datas=[ [0] * 198 for i in range(198)]
with open(inputfile,'r') as f:
    i=0
    for line in f:
        nums=(line[1:].strip("\n")).split(' ')
        for j in range(len(nums)):
            datas[i][j]=int(nums[j])
        i=i+1
f.close()


value=[0 for i in range(198)]
links=[]
for i in range(198):
    for j in range(i):
        if datas[i][j]==1:
            link={"source":"Node"+str(i),"target":"Node"+str(j)}
            links.append(link)
            value[i]=value[i]+1
            value[j]=value[j]+1

nodes=[]
for i in range(198):
    outs=[]
    for j in range(len(links)):
        if links[j]["source"]=="Node"+str(i):
            outs.append(links[j]["target"])
        if links[j]["target"] == "Node" + str(i):
            outs.append(links[j]["source"])
    node={"id":"Node"+str(i),"value":value[i],"out":outs}
    nodes.append(node)

data_write={"nodes":nodes,"links":links}

with open(filename,'w') as file_obj:
    json.dump(data_write,file_obj)