const courses = [
 {id:'CS 201', name:['Data Structures','数据结构'], dept:['Computer Science','计算机科学'], teacher:'Dr. Maya Chen', tone:'indigo', icon:'code-xml', done:4, total:6, grade:94, topics:[['Algorithm Analysis','算法分析'],['Arrays & Linked Lists','数组与链表'],['Stacks & Queues','栈与队列'],['Recursion','递归'],['Trees & Traversals','树与遍历'],['Graphs & Search','图与搜索']], lesson:['A binary tree gives each node at most two children. Inorder traversal visits the left subtree first, then the root, then the right subtree. Try writing down the order for a root of 4 with children 2 and 6.','二叉树的每个节点最多有两个子节点。中序遍历先访问左子树，再访问根节点，最后访问右子树。试着写出根节点为 4、两个子节点为 2 和 6 时的遍历顺序。']},
 {id:'LANG 110', name:['Academic English','学术英语'], dept:['Language Studies','语言学习'], teacher:'Prof. Elena Brooks', tone:'teal', icon:'messages-square', done:3, total:6, grade:91, topics:[['Reading for Argument','阅读与论证'],['Evaluating Sources','评估来源'],['Paraphrasing','改写'],['The Academic Essay','学术论文'],['Peer Review','同伴互评'],['Presenting Research','研究展示']], lesson:['An academic essay makes a claim and supports it with evidence. Draft a one-sentence thesis, then outline two paragraphs that give distinct reasons to support it.','学术论文提出论点并用证据支持。先写一句中心论点，再列出两个段落提纲，用不同理由来支持它。']},
 {id:'MATH 221', name:['Linear Algebra','线性代数'], dept:['Mathematics','数学'], teacher:'Dr. Omar Patel', tone:'amber', icon:'sigma', done:5, total:6, grade:96, topics:[['Systems of Equations','方程组'],['Matrix Operations','矩阵运算'],['Vector Spaces','向量空间'],['Linear Independence','线性无关'],['Determinants','行列式'],['Eigenvalues','特征值']], lesson:['For an eigenvector v of a matrix A, multiplying by A scales v by the eigenvalue λ: Av = λv. Check whether (1, 0) is an eigenvector of the diagonal matrix with entries 2 and 3.','对于矩阵 A 的特征向量 v，有 Av = λv，其中 λ 是特征值。请判断 (1, 0) 是否为对角元素分别为 2 和 3 的对角矩阵的特征向量。']}
];
const assignments = [
 {id:'trees', course:0, name:['Binary Tree Lab','二叉树实验'], day:23, time:'11:59 PM', brief:['Implement an inorder traversal for a binary tree and explain its time complexity. Include a short test with a three-node tree.','实现二叉树的中序遍历并解释时间复杂度。请附上一个三节点树的简单测试。']},
 {id:'essay', course:1, name:['Argumentative Essay Draft','议论文初稿'], day:25, time:'5:00 PM', brief:['Write a 500-word draft with a clear thesis and evidence from two credible sources.','撰写约 500 字的初稿，给出明确论点，并引用两个可信来源。']},
 {id:'vectors', course:2, name:['Problem Set 6','习题集 6'], day:27, time:'11:59 PM', brief:['Find the eigenvalues of the diagonal matrix with entries 2 and 3. Show your reasoning and give one eigenvector for each.','求对角元素为 2 和 3 的对角矩阵的特征值，展示推导过程并为每个特征值给出一个特征向量。']}
];
const initial = {
 lang:0, role:'student', modules:{}, submissions:{}, records:{}, paid:false, ticket:'',
 notices:[
  {icon:'megaphone',tone:'indigo', title:['Week 10 materials are live','第 10 周资料已发布'], detail:['Data Structures · Dr. Maya Chen','数据结构 · Maya Chen 老师'], date:['Today','今天'], route:'course:0'},
  {icon:'award',tone:'teal',title:['Quiz 2 grade posted','测验 2 成绩已发布'],detail:['Linear Algebra · 96 / 100','线性代数 · 96 / 100'],date:['Yesterday','昨天'],route:'grades'},
  {icon:'message-circle',tone:'amber',title:['Essay peer review is open','论文互评已开放'],detail:['Academic English · Discussion board','学术英语 · 讨论区'],date:['Nov 19','11月19日'],route:'discussion'}
 ],
 threads:[
  {id:'tree-thread',course:0,title:'How do you test tree traversal?',titleZh:'如何测试树的遍历？',body:'I’m using an empty tree and a tree with three nodes. What other cases should I check?',bodyZh:'我正在使用空树和三节点树做测试。还有哪些情况值得检查？',author:'Jamie Park',replies:[]},
  {id:'essay-thread',course:1,title:'Essay draft peer review',titleZh:'论文初稿互评',body:'Share your thesis here if you’d like informal feedback before submitting.',bodyZh:'如果想在提交前获得一些反馈，可以在这里分享你的中心论点。',author:'Prof. Elena Brooks',replies:[]},
  {id:'math-thread',course:2,title:'Eigenvalues study group',titleZh:'特征值学习小组',body:'I’m reviewing how to find eigenvectors. Would anyone like to work through a practice problem?',bodyZh:'我正在复习如何求特征向量。有人想一起做一道练习题吗？',author:'Morgan Lee',replies:[]}
 ]
};
const labels = {
 dashboard:['Overview','总览'], courses:['My courses','我的课程'], assignments:['Assignments','作业'], grades:['Grades','成绩'], attendance:['Attendance','考勤'], discussion:['Discussions','讨论区'], wellbeing:['Wellbeing','身心健康'], help:['Help center','帮助中心'], payments:['Payments','费用支付'], notifications:['Notifications','通知'],
};
