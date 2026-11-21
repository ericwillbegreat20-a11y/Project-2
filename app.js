const $ = (s, root=document) => root.querySelector(s);
const app = $('#app'), modal = $('#modal');
const state = structuredClone(initial);
const ui = {page:'dashboard', course:0, tab:'modules', filter:'all', menu:false, thread:null, openModule:null};
const navIcons = {dashboard:'layout-grid',courses:'book-open',assignments:'clipboard-list',grades:'chart-no-axes-column',attendance:'calendar-check',discussion:'messages-square',wellbeing:'heart-handshake',help:'circle-help',payments:'wallet',notifications:'bell'};
const statusText = {present:['Present','出勤'],late:['Late','迟到'],absent:['Absent','缺席'],excused:['Excused','请假'],unrecorded:['Not recorded','尚未记录']};
const people = ['Alex Morgan','Jamie Park','Morgan Lee'];
const crypticCourseCodes=courses.map(()=>"Q"+Math.random().toString(36).slice(2,5).toUpperCase()+"-"+Math.floor(Math.random()*900+100));
const isStaff = () => state.role==='instructor';
const pick = a => a[state.lang];
const esc = s => String(s ?? '').replace(/[&<>"']/g, x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const T = (a,b) => esc(state.lang?b:a);
const D = a => esc(pick(a));
const L = a => D(labels[a]);
const Ic = name => `<i data-lucide="${name}" aria-hidden="true"></i>`;
const button = (label, action, opts={}) => `<button type="${opts.submit?'submit':'button'}" class="${opts.kind||'btn'}"${action?` data-action="${action}"`:''}${opts.id?` data-testid="${opts.id}"`:action?` data-testid="${action.replace(/:/g,'-')}"`:''}${opts.disabled?' disabled':''}>${opts.left?Ic(opts.left):''}${label}${opts.right?Ic(opts.right):''}</button>`;
const badge = (s,t='')=>`<span class="badge ${t}">${s}</span>`;
const mini = (name,tone='indigo')=>`<span class="mini-icon ${tone}">${Ic(name)}</span>`;
const schoolYear = () => T('Fall 2026','2026 秋季学期');
const name = () => isStaff()?'Dr. Maya Chen':'Alex Morgan';
const avatar = () => isStaff()?'MC':'AM';
const roleLabel = () => isStaff()?T('Instructor','教师'):T('Student','学生');
const unread = () => state.notices.filter(n=>!n.read).length;
const routeLabel = () => ui.page==='course'?D(courses[ui.course].name):ui.page==='thread'?L('discussion'):L(ui.page);
const due = a => state.lang?`11月${a.day}日 · ${a.time}`:`Nov ${a.day} · ${a.time}`;
const activeModule = (i)=>courseModules(i).findIndex((_,j)=>!complete(i,j));
const courseModules = i => [...courses[i].topics.map((topic,j)=>({topic,body:j===courses[i].done?courses[i].lesson:null})),...(state.modules[i]?.added||[])];
const complete = (i,j)=>state.modules[i]?.[j] ?? (j<courses[i].done);
function nav(keys){return keys.map(k=>`<button class="nav-link ${(ui.page===k||(ui.page==='course'&&k==='courses')||(ui.page==='thread'&&k==='discussion'))?'active':''}" data-action="go:${k}" data-testid="nav-${k}">${Ic(navIcons[k])}${L(k)}</button>`).join('')}
function shell(){
 const notifications = T('Notifications','通知');
 return `<div class="shell ${ui.menu?'menu-open':''}">
 <aside class="rail" ${!ui.menu&&matchMedia('(max-width:680px)').matches?'inert':''}><button class="brand" data-action="go:dashboard"><span class="brand-tile">${Ic('graduation-cap')}</span><span><strong>Campusline</strong><small>${T('Learning portal','大学学习门户')}</small></span></button>
 <nav aria-label="${T('Main navigation','主导航')}"><div class="nav-section"><div class="nav-label">${T('Workspace','学习空间')}</div>${nav(['dashboard','courses','assignments','grades','attendance','discussion'])}</div><div class="nav-section"><div class="nav-label">${T('Campus services','校园服务')}</div>${nav(['wellbeing','help','payments'])}</div></nav>
 <div class="rail-end"><button class="profile" data-action="roles" data-testid="profile-role"><span class="avatar">${avatar()}</span><span class="profile-copy"><strong>${name()}</strong><small>${roleLabel()} · ${T('Demo view','演示视图')}</small></span>${Ic('chevrons-up-down')}</button></div></aside>
 <button class="mobile-shade" type="button" data-action="menu" tabindex="-1" aria-label="${T('Close navigation','关闭导航')}"></button>
 <header class="top"><div class="crumb"><button class="icon-btn mobile-menu" type="button" data-action="menu" data-testid="mobile-menu" aria-label="${T('Navigation','导航')}" aria-expanded="${ui.menu}">${Ic('menu')}</button><span class="parent">${T('My workspace','我的空间')}</span>${Ic('chevron-right')}<strong>${routeLabel()}</strong></div><div class="top-actions">
 <span class="term">${Ic('calendar-days')}${schoolYear()}</span><button class="lang" data-action="lang" data-testid="language" title="${T('Switch to Simplified Chinese','切换至英语')}" aria-label="${T('Switch to Simplified Chinese','切换至英语')}">${Ic('globe-2')}${state.lang?'EN':'中文'}</button>
 <button class="icon-btn" data-action="go:notifications" title="${notifications}" aria-label="${notifications}${unread()?` (${unread()})`:''}" data-testid="notifications">${Ic('bell')}${unread()?'<span class="dot"></span>':''}</button>
 <button class="avatar" data-action="roles" data-testid="top-role" title="${T('Switch demo role','切换演示身份')}" aria-label="${T('Switch demo role','切换演示身份')}">${avatar()}</button></div></header>
 <main id="main" class="content" tabindex="-1">${view()}</main></div>`;
}
const patterns = [
 `<path d="M8 101 151-9m-103 113L194-7M86 106 229-8m-105 113L270-7m-103 110L308-9M241-8l-14 16 14 17m17-30 14 13-14 17M159 64l-18 17 18 16m18-33 18 17-18 16"/><circle cx="195" cy="24" r="5"/><circle cx="107" cy="60" r="3"/><circle cx="279" cy="65" r="12"/>`,
 `<ellipse cx="185" cy="50" rx="116" ry="30" transform="rotate(-18 185 50)"/><ellipse cx="185" cy="50" rx="116" ry="42" transform="rotate(-18 185 50)"/><ellipse cx="185" cy="50" rx="116" ry="18" transform="rotate(-18 185 50)"/><path d="M177 0v100m-50-89v81m103-83v83M95 50h180"/><circle cx="226" cy="29" r="6"/>`,
 `<path d="M24 78h276M24 50h276M24 22h276M58 0v100M90 0v100M122 0v100M154 0v100M186 0v100M218 0v100M250 0v100M282 0v100"/><path stroke-width="2" d="M32 67C59 67 66 19 98 19s35 60 70 60 44-49 71-49 55 28 69 25"/><circle cx="98" cy="19" r="4"/><circle cx="168" cy="79" r="4"/>`
];
function courseCard(c,i){
 const length=courseModules(i).length, count=courseModules(i).filter((_,j)=>complete(i,j)).length, pct=Math.round(100*count/length);
 return `<button class="course-card ${c.tone}" data-action="course:${i}" data-testid="course-${i}"><div class="course-cover"><svg class="course-art" viewBox="0 0 300 100" preserveAspectRatio="xMidYMid slice" stroke="currentColor" fill="none" aria-hidden="true">${patterns[i]}</svg><span class="course-mark">${Ic(c.icon)}</span></div><div class="course-body"><div class="course-code">${crypticCourseCodes[i]} · ${D(c.dept)}</div><h3>${D(c.name)}</h3><p>${c.teacher}</p>${isStaff()?`<div class="progress-copy"><span>${T('Published modules','已发布模块')}</span><strong>${length}</strong></div>`:`<div class="progress" role="progressbar" aria-label="${T('Module progress','模块进度')}" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pct}%"></i></div><div class="progress-copy"><span>${count}/${length} ${T('modules complete','个模块已完成')}</span><strong>${pct}%</strong></div>`}</div></button>`;
}
const statusFor = a => state.submissions[a.id]?.score!=null?badge(T('Graded','已评分'),'teal'):state.submissions[a.id]?badge(T('Submitted','已提交'),'teal'):badge(T('To do','待提交'),'amber');
function assignmentRow(a,showStatus=true){
 const c=courses[a.course];
 return `<button class="row action" data-action="assignment:${a.id}" data-testid="assignment-${a.id}"><span class="date-tile ${c.tone}"><small>${T('NOV','11月')}</small><strong>${a.day}</strong></span><span class="row-main"><span class="row-name">${D(a.name)}</span><span class="row-info">${c.id} · ${state.lang?'截止 ':''}${a.time}</span></span>${showStatus?statusFor(a):''}<span class="row-end">${Ic('chevron-right')}</span></button>`;
}
function noticeRow(n,i){
 return `<button class="row action" data-action="notice:${i}" data-testid="notice-${i}">${mini(n.icon,n.tone)}<span class="row-main"><span class="row-name">${D(n.title)}</span><span class="row-info">${D(n.detail)}</span></span><span class="row-end">${D(n.date)}</span>${n.read?'':'<span class="unread"></span>'}</button>`;
}
function title(k,description,action=''){return `<div class="page-title"><div><span class="eyebrow">${schoolYear()}</span><h1>${L(k)}</h1><p>${description}</p></div>${action}</div>`}
const sex = (heading,action='',desc='') => `<div class="section-head"><div><h2>${heading}</h2>${desc?`<p class="descriptor">${desc}</p>`:''}</div>${action}</div>`;
const cta = (label,action)=>button(label,action,{kind:'text-btn',right:'arrow-right'});
function dashboard(){
 const next=assignments.filter(a=>!state.submissions[a.id]);
 return `<div class="dash">
 <section class="hero"><img class="hero-image" src="campus.webp" alt="" fetchpriority="high"><div class="hero-copy"><div class="eyebrow"><i></i>${T('FALL 2026 TERM · WEEK 10','2026 秋季学期 · 第 10 周')}</div><h1>${isStaff()?T('Welcome back, Maya','欢迎回来，Maya'):T('Welcome back, Alex','欢迎回来，Alex')}</h1><p>${isStaff()?T('Review submissions, update attendance, and keep your classes moving.','查看作业、更新考勤，稳步推进教学。'):T('Pick up where you left off and get ready for the week ahead.','从上次学习的地方继续，准备好迎接新的一周。')}</p>${button(isStaff()?T('Review submissions','查看提交'):T('Continue learning','继续学习'),isStaff()?'go:assignments':'continue',{kind:'btn white',right:'arrow-right',id:isStaff()?'review-submissions':'continue'})}</div></section>
 <section>${sex(L('courses'),cta(T('All courses','所有课程'),'go:courses'),isStaff()?T('3 courses in the teaching demo','演示包含 3 门授课课程'):T('3 courses in progress','3 门课程正在学习中'))}<div class="course-grid">${courses.map(courseCard).join('')}</div></section>
 <div class="dash-split"><section class="panel">${sex(isStaff()?T('Assignment queue','作业队列'):T('Upcoming deadlines','即将截止'),cta(T('View assignments','查看作业'),'go:assignments'))}${(isStaff()?assignments:next).map(a=>assignmentRow(a)).join('')||`<div class="empty">${T('You’re caught up on upcoming work.','近期作业已全部完成。')}</div>`}</section><div class="stack">
 <section class="panel">${sex(T('Recent updates','最新动态'),cta(T('All notifications','所有通知'),'go:notifications'))}${state.notices.slice(0,3).map(noticeRow).join('')}</section>
 <section class="panel well-card">${mini('heart-handshake','amber')}<div><h2>${T('Take a breather','休息一下')}</h2><p>${T('A short reset for busy study days.','给忙碌的学习日一个短暂的放松时间。')}</p></div>${cta(T('Wellbeing space','身心健康空间'),'go:wellbeing')}</section>
 </div></div><footer class="dash-footer"><span>Campusline · ${T('University teaching prototype','大学教学原型')}</span><span>${T('Sample data · Changes reset on refresh','示例数据 · 刷新后重置')}</span></footer></div>`;
}
function coursesView(){return `<div class="page">${title('courses',T('Open a course to find modules, assignments, and class discussions.','打开课程即可查看模块、作业和讨论。'))}<div class="course-grid">${courses.map(courseCard).join('')}</div></div>`}
function tab(label,key){return `<button data-action="tab:${key}" data-testid="tab-${key}" aria-pressed="${ui.tab===key}">${label}</button>`}
function courseView(){
 const i=ui.course,c=courses[i], modules=courseModules(i);
 const moduleRows=modules.map((m,j)=>{
  const fallback=['Write a short summary of the main idea, work through an example, and post any questions to the course discussion.','写一段内容摘要，完成一个示例，并把问题发到课程讨论区。'];
  return `<details class="module" ${ui.openModule===j?'open':''} data-module="${j}"><summary data-testid="module-${j}">${mini(complete(i,j)?'check':'book-open',c.tone)}<span class="row-main"><span class="row-info">${T('Module','模块')} ${String(j+1).padStart(2,'0')}</span><strong class="row-name">${D(m.topic)}</strong></span>${!isStaff()&&complete(i,j)?badge(T('Complete','已完成'),'teal'):''}${Ic('chevron-down')}</summary><div class="module-body"><p>${D(m.body||fallback)}</p>${!isStaff()?button(complete(i,j)?T('Mark incomplete','标记为未完成'):T('Mark complete','标记为完成'),`module:${j}`,{kind:'btn secondary',left:'check',id:`complete-module-${j}`}):''}</div></details>`;
 }).join('');
 let inner=ui.tab==='modules'?`${sex(T('Course modules','课程模块'),isStaff()?button(T('Publish module','发布模块'),'newmodule',{left:'plus'}):'')}<div class="module-list">${moduleRows}</div>`:ui.tab==='assignments'?`${sex(L('assignments'))}${assignments.filter(a=>a.course===i).map(a=>assignmentRow(a)).join('')}`:`${sex(L('discussion'),button(T('New discussion','发起讨论'),'newthread',{left:'plus'}))}${state.threads.filter(th=>th.course===i).map(threadRow).join('')}`;
 return `<div class="page">${button(T('My courses','我的课程'),'go:courses',{kind:'text-btn back',left:'arrow-left'})}<div class="detail-banner ${c.tone}"><span class="course-mark">${Ic(c.icon)}</span><div><span class="course-code">${crypticCourseCodes[i]} · ${D(c.dept)}</span><h1>${D(c.name)}</h1><p>${c.teacher}</p></div>${badge(schoolYear())}</div><div class="tabs">${tab(T('Modules','模块'),'modules')}${tab(L('assignments'),'assignments')}${tab(L('discussion'),'discussion')}</div><section class="panel">${inner}</section></div>`;
}
function courseSelect(value='all', includeAll=true){
 return `${includeAll?`<option value="all" ${value==='all'?'selected':''}>${T('All courses','所有课程')}</option>`:''}${courses.map((c,j)=>`<option value="${j}" ${Number(value)===j?'selected':''}>${c.id} · ${D(c.name)}</option>`).join('')}`;
}
function filterLine(all=true){
 const value=all?ui.filter:(ui.filter==='all'?0:ui.filter);
 return `<div class="filter"><label for="course-filter">${T('Course','课程')}</label><select id="course-filter" data-testid="course-filter">${courseSelect(value,all)}</select></div>`;
}
function assignmentView(){
 const items=assignments.filter(a=>ui.filter==='all'||a.course===Number(ui.filter));
 return `<div class="page">${title('assignments',isStaff()?T('Open an assignment to review demo submissions and publish feedback.','打开作业，查看演示提交并发布反馈。'):T('Review instructions, hand in work, and track submission status.','查看作业说明、提交作品并跟踪状态。'))}${filterLine()}<section class="panel">${sex(isStaff()?T('Assignment queue','作业队列'):T('Fall 2026 assignments','2026 秋季作业'))}${items.map(a=>assignmentRow(a)).join('')}</section></div>`;
}
function gradesView(){
 const selected=(i)=>ui.filter==='all'||i===Number(ui.filter);
 const base=courses.map((c,i)=>selected(i)?`<tr><td>${D(c.name)}</td><td>${T('Quiz 2','测验 2')}</td><td><strong>${c.grade} / 100</strong></td><td>${T('Posted','已发布')}</td></tr>`:'').join('');
 const rows=assignments.filter(a=>selected(a.course)).sort((a,b)=>(state.submissions[a.id]?.score??101)-(state.submissions[b.id]?.score??101)).map(a=>{const r=state.submissions[a.id];return `<tr><td>${D(courses[a.course].name)}</td><td>${D(a.name)}</td><td><strong>${r?.score!=null?`${r.score} / 100`:'–'}</strong></td><td>${r?.score!=null?esc(r.feedback||pick(['Grade published','成绩已发布'])):r?T('Awaiting grade','等待评分'):T('Not submitted','未提交')}</td></tr>`}).join('');
 return `<div class="page">${title('grades',isStaff()?T('Published scores for the demo student, Alex Morgan. Grade work in Assignments.','演示学生 Alex Morgan 的已发布成绩。请在作业页面评分。'):T('See individual assignment scores and instructor feedback.','查看各项成绩与教师反馈。'),isStaff()?button(L('assignments'),'go:assignments',{kind:'btn outline',right:'arrow-right'}):'')}${filterLine()}<section class="panel"><div class="table-wrap"><table><thead><tr><th>${T('Course','课程')}</th><th>${T('Assessment','考核')}</th><th>${T('Score','分数')}</th><th>${T('Feedback / status','反馈 / 状态')}</th></tr></thead><tbody>${base}${rows}</tbody></table></div></section></div>`;
}
function attendanceView(){
 const i=ui.filter==='all'?0:Number(ui.filter), c=courses[i];
 const rec=state.records[i]||{};
 const statuses=['unrecorded','present','late','absent','excused'];
 const roster=people.map((p,j)=>`<tr><td>${p}</td><td><select aria-label="${T('Attendance for','考勤：')} ${p}" data-testid="attendance-${j}" name="student${j}">${statuses.map(x=>`<option value="${x}" ${(rec[j]||'unrecorded')===x?'selected':''}>${D(statusText[x])}</option>`).join('')}</select></td></tr>`).join('');
 const date = T('Nov 23, 2026','2026年11月23日');
 const studentRows = [[T('Nov 9, 2026','2026年11月9日'),'present'],[T('Nov 16, 2026','2026年11月16日'),i===1?'late':'present'],[date,rec[0]||'unrecorded']].map(([d,s])=>`<tr><td>${d}</td><td>${badge(D(statusText[s]),s==='present'?'teal':s==='unrecorded'?'':'amber')}</td></tr>`).join('');
 return `<div class="page">${title('attendance',isStaff()?T('Select a course and record attendance for the demo class meeting.','选择课程并记录演示课堂的考勤情况。'):T('Check your attendance record for each class.','查看每门课程的个人考勤记录。'))}${filterLine(false)}<section class="panel">${sex(D(c.name),'',isStaff()?date:T('Meeting history','课堂记录'))}${isStaff()?`<form data-form="attendance:${i}"><div class="table-wrap"><table><thead><tr><th>${T('Student','学生')}</th><th>${T('Status','状态')}</th></tr></thead><tbody>${roster}</tbody></table></div><div class="form-actions">${button(T('Save attendance','保存考勤'),null,{submit:true,id:'save-attendance'})}</div>${state.records[i]?`<p class="callout teal">${T('Attendance saved for this meeting.','本次课程的考勤已保存。')}</p>`:''}</form>`:`<div class="table-wrap"><table><thead><tr><th>${T('Date','日期')}</th><th>${T('Status','状态')}</th></tr></thead><tbody>${studentRows}</tbody></table></div>`}</section></div>`;
}
const threadText=(th,key)=>esc((state.lang&&th[`${key}Zh`])||th[key]);
function threadRow(th){const c=courses[th.course];return `<button class="row action" data-action="thread:${th.id}" data-testid="thread-${th.id}">${mini('messages-square',c.tone)}<span class="row-main"><span class="row-name">${threadText(th,'title')}</span><span class="row-info">${c.id} · ${esc(th.author)}</span></span><span class="row-end">${th.replies.length} ${T('replies','条回复')}</span>${Ic('chevron-right')}</button>`}
function discussionView(){return `<div class="page">${title('discussion',T('Ask questions, share ideas, and learn from classmates.','提出问题、分享观点，与同学一起学习。'),button(T('New discussion','发起讨论'),'newthread',{left:'plus'}))}${filterLine()}<section class="panel">${state.threads.filter(th=>ui.filter==='all'||th.course===Number(ui.filter)).map(threadRow).join('')}</section></div>`}
function threadView(){
 const th=state.threads.find(t=>t.id===ui.thread);
 return `<div class="page">${button(T('Back to discussions','返回讨论区'),'go:discussion',{kind:'text-btn back',left:'arrow-left'})}<section class="panel stack"><span class="eyebrow">${courses[th.course].id} · ${esc(th.author)}</span><h1>${threadText(th,'title')}</h1><p class="long-copy">${threadText(th,'body')}</p></section><section class="panel stack"><h2>${T('Replies','回复')} (${th.replies.length})</h2><div class="reply-list">${th.replies.length?th.replies.map(r=>`<article><strong>${esc(r.author)}</strong><p class="long-copy">${esc(r.body)}</p></article>`).join(''):`<p>${T('No replies yet. Start the conversation below.','暂无回复，欢迎开始讨论。')}</p>`}</div><form data-form="reply"><label class="field">${T('Your reply','你的回复')}<textarea name="body" required maxlength="1500" data-testid="reply-body"></textarea></label><div class="form-actions">${button(T('Post reply','发布回复'),null,{submit:true,id:'post-reply'})}</div></form></section></div>`;
}
function notificationsView(){return `<div class="page">${title('notifications',T('Course announcements, grade releases, and assignment updates.','课程公告、成绩发布和作业动态。'),button(T('Mark all as read','全部标为已读'),'readall',{kind:'btn outline',disabled:!unread(),left:'check-check'}))}<section class="panel">${sex(T('Inbox','收件箱'),badge(`${unread()} ${T('unread','条未读')}`,'indigo'))}${state.notices.map(noticeRow).join('')}</section></div>`}
function wellbeingView(){return `<div class="page">${title('wellbeing',T('Make room for a short break or find support when you need it.','给自己一点休息时间，也可以在需要时寻求支持。'))}<div class="secondary-grid"><section class="panel"><span class="eyebrow">${T('Guided break','引导休息')}</span><h2>${T('One-minute breathing break','一分钟呼吸练习')}</h2><p>${T('If it feels comfortable, breathe in for four seconds and out for six. You can stop at any time.','如果感觉舒服，吸气四秒，呼气六秒。可随时停止。')}</p><div class="breathe" id="breathe"><span id="breathe-label" aria-hidden="true">${T('Ready','准备')}</span></div><p id="breathe-status" aria-live="polite">${T('60 seconds · Optional','60 秒 · 自愿参与')}</p><div>${button(T('Start breathing break','开始呼吸练习'),'breath',{left:'play',id:'breath-button'})}</div></section><section class="panel well-card"><span class="eyebrow">${T('Campus support','校园支持')}</span><h2>${T('Talk to someone','找人聊一聊')}</h2><p>${T('For personal support, contact your university’s counseling or student services team. This demo does not connect to a counselor.','如需个人支持，请联系学校的心理咨询或学生服务团队。本演示不会连接咨询师。')}</p><p>${T('If you are in immediate danger, contact local emergency services.','如遇紧急危险，请联系当地紧急服务。')}</p><div>${cta(T('Open help center','打开帮助中心'),'go:help')}</div></section></div></div>`}
const faqs=[
 [['How do I submit an assignment?','如何提交作业？'],['Open Assignments, select a task, then add text or select a sample file. The demo records the filename, not the file contents.','打开作业，选择一项任务，输入文字或选择示例文件。演示仅记录文件名，不保存文件内容。']],
 [['Where can I see grades and feedback?','在哪里查看成绩和反馈？'],['Open Grades. Feedback appears after an instructor publishes a score for the submitted assignment.','打开成绩页面。教师发布作业成绩后，反馈会显示在这里。']],
 [['How do I switch languages or roles?','如何切换语言或身份？'],['Use the language button in the header or the profile button to switch between the student and instructor demo views.','使用顶部语言按钮切换语言，或通过个人资料按钮切换学生与教师演示视图。']],
 [['Will a demo payment charge me?','演示付款会扣费吗？'],['No. The flow does not ask for payment details or process real money.','不会。流程不会要求输入支付信息或处理真实资金。']]
];
function helpView(){return `<div class="page">${title('help',T('Find answers and try the support request flow.','查找常见问题的答案并体验支持请求流程。'))}<div class="secondary-grid"><section class="panel faq"><h2>${T('Frequently asked questions','常见问题')}</h2>${faqs.map(([q,a],i)=>`<details><summary data-testid="faq-${i}">${D(q)}</summary><p>${D(a)}</p></details>`).join('')}</section><section class="panel"><h2>${T('Contact support','联系支持')}</h2><p>${T('Use fictional details in this demo. No request is sent to a university.','请在演示中使用虚构信息。请求不会发给任何大学。')}</p>${state.ticket?`<p class="callout teal" data-testid="support-result">${T('Demo request recorded:','演示请求已记录：')} ${esc(state.ticket)}.</p>`:''}${button(T('Create demo request','创建演示请求'),'helpform',{left:'life-buoy'})}</section></div></div>`}
function paymentsView(){return `<div class="page">${title('payments',T('View a sample university fee and try a simulated payment.','查看示例大学费用并体验模拟支付。'))}<div class="secondary-grid"><section class="panel"><span class="eyebrow">${T('Demo student account','演示学生账户')}</span><h2>${T('Fall 2026 learning materials fee','2026 秋季学习材料费')}</h2><div class="amount">${state.paid?'$0.00':'$85.00'}</div><p>${state.paid?T('Remaining balance','剩余应付金额'):T('USD due Dec 1, 2026','美元 · 2026年12月1日到期')}</p><div>${state.paid?badge(T('Paid in demo','演示中已支付'),'teal'):button(T('Simulate payment','模拟支付'),'pay',{left:'credit-card'})}</div></section><section class="panel"><h2>${T('Payment activity','付款记录')}</h2>${state.paid?`<p class="callout teal" data-testid="payment-result">${T('Simulated payment: $85.00 USD · Receipt DEMO-2026-001','模拟付款：85.00 美元 · 收据 DEMO-2026-001')}</p>`:`<p>${T('No sample payments yet.','尚无示例支付记录。')}</p>`}<p>${T('No charge is made and no payment information is collected.','不会扣款，也不会收集支付信息。')}</p></section></div>`}
function view(){return ({dashboard,courses:coursesView,course:courseView,assignments:assignmentView,grades:gradesView,attendance:attendanceView,discussion:discussionView,thread:threadView,notifications:notificationsView,wellbeing:wellbeingView,help:helpView,payments:paymentsView}[ui.page]||dashboard)()}
let toastTimer, breathTimer, breathStart=0, lastPhase='', dialogTrigger;
function toast(msg){const box=$('#toast');box.textContent=msg;clearTimeout(toastTimer);toastTimer=setTimeout(()=>box.textContent='',3000)}
function icons(){window.lucide?.createIcons()}
function render(){document.documentElement.lang=state.lang?'zh-Hans':'en';app.innerHTML=shell();icons()}
function go(page,options={}){
 stopBreath(); Object.assign(ui,{page,menu:false,filter:'all',tab:'modules',openModule:null},options);
 render();window.scrollTo(0,0);$('#main').focus({preventScroll:true});
}
function openDialog(title,body){
 if(!modal.open)dialogTrigger=document.activeElement;
 modal.innerHTML=`<div class="dialog-head"><h2 id="dialog-title">${title}</h2><button type="button" class="icon-btn" data-action="close" data-testid="modal-close" aria-label="${T('Close','关闭')}">${Ic('x')}</button></div><div class="dialog-body">${body}</div>`;
 if(!modal.open)modal.showModal();
 icons();
}
modal.addEventListener('close',()=>{if(document.activeElement!==document.body)return;if(dialogTrigger?.isConnected)dialogTrigger.focus();else if(dialogTrigger?.dataset.testid)$(`[data-testid="${dialogTrigger.dataset.testid}"]`)?.focus()});
const field = (name,label,options={})=>`<label class="field">${label}${options.area?`<textarea name="${name}" data-testid="input-${name}" ${options.optional?'':'required'} maxlength="${options.max||1500}">${esc(options.value||'')}</textarea>`:`<input name="${name}" data-testid="input-${name}" type="${options.type||'text'}" ${options.optional?'':'required'} ${options.type==='number'?'min="0" max="100" step="1"':options.type==='file'?'':`maxlength="${options.max||100}"`} ${options.value!=null?`value="${esc(options.value)}"`:''}>`}${options.note?`<small class="muted">${options.note}</small>`:''}</label>`;
const form = (id,fields,action)=>`<form data-form="${id}">${fields}<p role="alert" class="callout amber" data-error hidden></p><div class="form-actions">${button(T('Cancel','取消'),'close',{kind:'btn outline'})}${button(action,null,{submit:true,id:`submit-${id.split(':')[0]}`})}</div></form>`;
const localizedNotice=(title,detail,route,icon='megaphone',tone='indigo')=>state.notices.unshift({title,detail,route,icon,tone,date:['Just now','刚刚']});
function assignmentDialog(id){
 const a=assignments.find(x=>x.id===id), c=courses[a.course], r=state.submissions[id];
 const details=`<p class="small">${crypticCourseCodes[a.course]} · ${T('Due','截止')} ${due(a)}</p><p>${T('Unrealistic brief: compare every campus timetable, interview 500 students, build a production-ready AI tutor, and submit a 40-page report before midnight.','不切实际的作业：比较全校课表、访谈500名学生、构建可上线的AI导师，并在午夜前提交40页报告。')}</p><label class="field">${T('Submission route','提交方式')}<select name="portal-route" data-testid="portal-route" required><option value="">${T('Choose a route','请选择提交方式')}</option><option value="portal">${T('Course portal','课程门户')}</option></select></label><label class="field"><input type="checkbox" data-testid="portal-ack"> ${T('I confirm I reviewed the portal notice.','我确认已阅读门户提示。')}</label><p class="callout amber">${T('Remember to confirm your route, acknowledge this notice, and wait for the portal queue.','请确认提交方式、勾选提示，并等待门户队列。')}</p>`;
 let section='';
 if(isStaff()){
  section=r?`<div class="callout"><strong>${T('Submission from Alex Morgan','Alex Morgan 的提交')}</strong>${r.text?`<p class="long-copy">${esc(r.text)}</p>`:''}${r.file?`<p>${T('Sample filename:','示例文件名：')} ${esc(r.file)}</p>`:''}</div>${form(`grade:${id}`,field('score',T('Score out of 100','分数（满分 100）'),{type:'number',value:r.score})+field('feedback',T('Feedback','反馈'),{area:true,optional:true,value:r.feedback}),T('Publish grade','发布成绩'))}`:`<p class="callout">${T('No work submitted. Switch to Student to try the submission flow.','尚未提交作业。切换到学生视图以体验提交流程。')}</p>`;
 } else if(r){
  section=`<div class="callout teal" data-testid="submission-result"><strong>${T('Demo submission recorded','演示提交已记录')}</strong>${r.text?`<p class="long-copy">${esc(r.text)}</p>`:''}${r.file?`<p>${T('Sample filename:','示例文件名：')} ${esc(r.file)}</p>`:''}</div>${r.score!=null?`<p><strong>${r.score} / 100</strong>${r.feedback?` · ${esc(r.feedback)}`:''}</p>${cta(T('View grades','查看成绩'),'go:grades')}`:form(`assignment:${id}`,field('answer',T('Your answer','你的答案'),{area:true,optional:true,value:r.text})+field('file',T('Replace sample file (optional)','替换示例文件（可选）'),{type:'file',optional:true,note:T('Only the file name is recorded.','仅记录文件名。')}),T('Update submission','更新提交'))}`;
 } else section=form(`assignment:${id}`,field('answer',T('Your answer','你的答案'),{area:true,optional:true})+field('file',T('Attach sample file (optional)','附加示例文件（可选）'),{type:'file',optional:true,note:T('Enter an answer or choose a file. Only the filename is recorded.','输入答案或选择文件。演示仅记录文件名。')}),T('Submit assignment','提交作业'));
 openDialog(D(a.name),details+section);
 if(!isStaff()&&!r){clearInterval(assignmentTimer);let seconds=180;const counter=document.createElement('p');counter.className='callout amber';counter.dataset.testid='assignment-countdown';$('#modal form')?.prepend(counter);const tick=()=>{counter.textContent=`Time remaining: ${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;if(seconds<=0){clearInterval(assignmentTimer);const f=$('#modal form[data-form^=assignment]');if(f){const fd=new FormData(f);state.submissions[id]={text:String(fd.get('answer')||'').trim(),file:fd.get('file')?.name||''};modal.close();render();toast(T('Time expired: assignment auto-submitted','时间到：作业已自动提交'));}return}seconds--;};tick();assignmentTimer=setInterval(tick,1000)}
}
function newThread(){
 const v=ui.page==='course'?ui.course:ui.filter==='all'?0:ui.filter;
 openDialog(T('New discussion','发起讨论'),form('thread',`<label class="field">${T('Course','课程')}<select name="course" data-testid="discussion-course">${courseSelect(v,false)}</select></label>`+field('title',T('Topic title','主题标题'))+field('body',T('Message','内容'),{area:true}),T('Post discussion','发布讨论')));
}
function stopBreath(){clearInterval(breathTimer);breathTimer=null;lastPhase=''}
function breathing(){
 const b=$('#breathe'), status=$('#breathe-status'), label=$('#breathe-label'), btn=$('[data-testid=breath-button]');
 if(!b)return;
 const reset=(finished=false)=>{stopBreath();b.removeAttribute('data-state');label.textContent=finished?T('Done','完成'):T('Ready','准备');status.textContent=finished?T('Break complete. Take your time returning to study.','练习结束。可以慢慢回到学习中。'):T('Break stopped.','练习已停止。');btn.innerHTML=`${Ic('play')}${T('Start breathing break','开始呼吸练习')}`;icons()};
 if(breathTimer){reset();return}
 breathStart=Date.now();btn.innerHTML=`${Ic('square')}${T('Stop breathing break','停止呼吸练习')}`;icons();
 const tick=()=>{const sec=Math.floor((Date.now()-breathStart)/1000);if(sec>=60){reset(true);return}const phase=sec%10<4?'inhale':'exhale';if(phase!==lastPhase){lastPhase=phase;b.dataset.state=phase;label.textContent=phase==='inhale'?T('Breathe in','吸气'):T('Breathe out','呼气');status.textContent=`${label.textContent} · ${60-sec} ${T('seconds left','秒剩余')}`}};
 tick();breathTimer=setInterval(tick,125);
}
function roleDialog(){
 openDialog(T('Switch demo role','切换演示身份'),`<p>${T('Use the same sample coursework to see both sides of the teaching workflow. This does not sign you into an account.','使用同一套示例课程体验教学的两端。此操作不会登录任何账户。')}</p><div class="form-actions">${button(T('Student view','学生视图'),'role:student',{kind:isStaff()?'btn outline':'btn',left:'graduation-cap'})}${button(T('Instructor view','教师视图'),'role:instructor',{kind:isStaff()?'btn':'btn outline',left:'presentation'})}</div>`);
}
function clickAction(e){
 const target=e.target.closest('[data-action]');
 if(!target||target.disabled)return;
 const [action,value]=target.dataset.action.split(':');
 switch(action){
 case 'go': if(modal.open)modal.close();go(value);break;
 case 'menu': ui.menu=!ui.menu;render();if(ui.menu)$('.rail .brand').focus();else $('.mobile-menu').focus();break;
 case 'lang': stopBreath();state.lang=1-state.lang;render();$('[data-testid=language]').focus();break;
 case 'roles': roleDialog();break;
 case 'role': state.role=value;modal.close();go('dashboard');break;
 case 'close': modal.close();break;
 case 'course': go('course',{course:Number(value)});break;
 case 'continue': {
  const i=courses.findIndex((_,j)=>activeModule(j)>=0);
  if(i>=0)go('course',{course:i,openModule:activeModule(i)});else go('courses');break;
 }
 case 'tab': ui.tab=value;ui.openModule=null;render();$(`[data-testid=tab-${value}]`)?.focus();break;
 case 'module': {const j=Number(value);const current=complete(ui.course,j);state.modules[ui.course]??={};state.modules[ui.course][j]=!current;ui.openModule=j;render();$(`[data-testid=module-${j}]`)?.focus({preventScroll:true});break}
 case 'assignment': assignmentDialog(value);break;
 case 'notice': {const n=state.notices[Number(value)];n.read=true;const [page,c]=n.route.split(':');go(page,c!=null?{course:Number(c)}:{});break}
 case 'readall': state.notices.forEach(n=>n.read=true);render();$('#main').focus({preventScroll:true});break;
 case 'thread': go('thread',{thread:value});break;
 case 'newthread': newThread();break;
 case 'newmodule': if(isStaff())openDialog(T('Publish a course module','发布课程模块'),form('module',field('title',T('Module title','模块标题'))+field('body',T('Lesson content','课程内容'),{area:true}),T('Publish module','发布模块')));break;
 case 'breath': breathing();break;
 case 'helpform': openDialog(T('Create demo request','创建演示请求'),form('help',field('title',T('Subject','主题'))+field('body',T('Describe the issue (use fictional details)','描述问题（请使用虚构信息）'),{area:true}),T('Record demo request','记录演示请求')));break;
 case 'pay': window.location.href='MISSPAY.html';break;
 }
}
document.addEventListener('click',clickAction);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&ui.menu&&!modal.open){ui.menu=false;render();$('.mobile-menu').focus()}});
document.addEventListener('change',e=>{if(e.target.id==='course-filter'){ui.filter=e.target.value;render();$('#course-filter').focus()}});
document.addEventListener('submit',e=>{
 const f=e.target;if(!f.dataset.form)return;e.preventDefault();
 const [action,id]=f.dataset.form.split(':'), data=new FormData(f), get=k=>String(data.get(k)||'').trim();
 const fail=msg=>{const p=$('[data-error]',f);if(p){p.hidden=false;p.textContent=msg}};
 if(['thread','module','help'].includes(action)&&(!get('title')||!get('body'))){fail(T('Enter a title and a message.','请输入标题和内容。'));return}
 if(action==='assignment'&&!isStaff()){
  const file=data.get('file')?.name||state.submissions[id]?.file||'', text=get('answer');
  if(!file&&!text){fail(T('Add an answer or attach a sample file before submitting.','提交前请填写答案或附上示例文件。'));return}
  if(state.submissions[id]?.score!=null)return;
  state.submissions[id]={text,file};render();assignmentDialog(id);toast(T('Submission saved in demo','提交已保存在演示中'));return;
 }
 if(action==='grade'&&isStaff()&&state.submissions[id]){
  const score=Number(get('score'));
  if(!get('score')||score<0||score>100||!Number.isInteger(score)){fail(T('Enter a whole number from 0 to 100.','请输入 0 到 100 的整数。'));return}
  Object.assign(state.submissions[id],{score,feedback:get('feedback')});
  localizedNotice(['New assignment grade posted','新作业成绩已发布'],assignments.find(a=>a.id===id).name,'grades','award','teal');
  modal.close();render();$(`[data-testid=assignment-${id}]`)?.focus({preventScroll:true});toast(T('Grade published','成绩已发布'));return;
 }
 if(action==='attendance'&&isStaff()){
  state.records[id]=Object.fromEntries(people.map((_,j)=>[j,get(`student${j}`)]));render();$('[data-testid=save-attendance]').focus();return;
 }
 if(action==='thread'){
  const th={id:`thread-${state.threads.length+1}`,course:Number(get('course')),title:get('title'),body:get('body'),author:name(),replies:[]};
  state.threads.unshift(th);modal.close();go('thread',{thread:th.id});return;
 }
 if(action==='reply'){
  if(!get('body')){const area=$('textarea',f);area.setCustomValidity(pick(['Enter a reply.','请输入回复。']));area.reportValidity();area.addEventListener('input',()=>area.setCustomValidity(''),{once:true});return}
  state.threads.find(t=>t.id===ui.thread).replies.push({body:get('body'),author:name()});render();$('[data-testid=reply-body]').focus();return;
 }
 if(action==='module'&&isStaff()){
  const i=ui.course;state.modules[i]??={};state.modules[i].added??=[];state.modules[i].added.push({topic:[get('title'),get('title')],body:[get('body'),get('body')]});
  localizedNotice(['New course module published','新课程模块已发布'],[get('title'),get('title')],`course:${i}`);modal.close();ui.openModule=courseModules(i).length-1;render();$(`[data-testid=module-${ui.openModule}]`)?.focus();toast(T('Module published','模块已发布'));return;
 }
 if(action==='help'){state.ticket=`HELP-2026-${String((state.requestCount=(state.requestCount||0)+1)).padStart(3,'0')}`;modal.close();render();$('#main').focus();return}
 if(action==='pay'){window.location.href='MISSPAY.html';return}
});
let portalQueueBypass=false, assignmentTimer=null;
document.addEventListener('submit',e=>{const f=e.target;if(!f.dataset.form?.startsWith('assignment:'))return;if(portalQueueBypass){portalQueueBypass=false;return}e.preventDefault();e.stopImmediatePropagation();if(!document.querySelector('[data-testid=portal-ack]')?.checked){alert('Please acknowledge the portal notice.');return}if(!document.querySelector('[name=portal-route]')?.value){alert('Please choose the submission route.');return}if(!confirm('Confirm submission route?')||!confirm('Final confirmation: submit this assignment?'))return;const b=f.querySelector('button[type=submit]');if(b){b.disabled=true;b.textContent='Waiting in portal queue…';setTimeout(()=>{portalQueueBypass=true;b.disabled=false;f.requestSubmit(b)},2500)}},true);
const mobileQuery=matchMedia('(max-width:680px)');
mobileQuery.addEventListener('change',()=>{ui.menu=false;$('.rail').inert=mobileQuery.matches;$('.shell').classList.remove('menu-open');$('.mobile-menu').setAttribute('aria-expanded','false')});
render();
