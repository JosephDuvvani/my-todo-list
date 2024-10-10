import './style.css';
import Group from './group';
import Project from './project';
import Task from './task';

const groupList = document.querySelector('.groups');

const myGroups = [];

const myProjects = Group();
myProjects.setName('My Projects');
myGroups.push(myProjects);

//Personal
const personal = Project();
personal.setName('Personal');
myProjects.addProject(personal);

const workout = Task();
workout.setTitle('Go to the Gym.');
workout.setPriority(2);

personal.addTask(workout);

const dinner = Task();
dinner.setTitle('Cook dinner.');
dinner.setPriority(1);

personal.addTask(dinner);

//Health
const health = Project();
health.setName('Health');
myProjects.addProject(health);

const doctor = Task();
doctor.setTitle('Doctor\'s appointment.');
doctor.setPriority(2);

health.addTask(doctor);

const dentist = Task();
dentist.setTitle('Dentist appointment.');
dentist.setPriority(1);

health.addTask(dentist);

//Work
const work = Project();
work.setName('Work');
myProjects.addProject(work);

const meeting = Task();
meeting.setTitle('Important meeting.');
meeting.setPriority(2);

work.addTask(meeting);

const workTrip = Task();
workTrip.setTitle('Work trip.');
workTrip.setPriority(1);

work.addTask(workTrip);

displayGroups(myGroups);

//Display Projects
function displayGroups(groups) {
    const groupTemp = document.getElementById('group-template');
    const projectTemp = document.getElementById('project-template');

    groupList.textContent = '';

    groups.forEach(element => {
        const tempContent = groupTemp.content.cloneNode(true);
        const name = tempContent.querySelector('.group-name');
        
        name.textContent = element.getName();

        const projectList = tempContent.querySelector('.projects-nav');

        groupList.appendChild(tempContent);      
        
        const myProjects = element.getProjects();

        myProjects.forEach(proj => {
            const item = document.createElement('li');
            item.setAttribute('data-index', `${myProjects.indexOf(proj)}`);

            const remove = document.createElement('div');
            remove.setAttribute('data-remove', `${myProjects.indexOf(proj)}`);
            remove.classList.add('delete-btn', 'delete-project');
            remove.textContent = '×';

            const projContent = projectTemp.content.cloneNode(true);
            const name = projContent.querySelector('.project-name');
            name.textContent = proj.getName();
            
            item.appendChild(projContent);
            item.appendChild(remove);
            projectList.appendChild(item);       
        });
    });
    updateProjectDisplayEvent();
}

//Display Tasks
function displayTaskList(project, index) {
    const title = document.getElementById('title');
    const tasks = document.querySelector('.task-list');
    const taskTemplate = document.getElementById('task');
    title.textContent = '';
    tasks.textContent = '';

    title.textContent = project.getName();

    const taskList = project.getTasks();

    taskList.forEach(task => {
        const tempContent = taskTemplate.content.cloneNode(true);
        const newTask = tempContent.querySelector('.task');
        const taskTitle = tempContent.querySelector('.task-title');
        const inputElement = tempContent.querySelector('.checkbox');
        const labelElement = tempContent.querySelector('.label');
        
        inputElement.setAttribute('id', `task-${taskList.indexOf(task)}`);
        labelElement.setAttribute('for', `task-${taskList.indexOf(task)}`);

        taskTitle.textContent = task.getTitle();

        const remove = document.createElement('div');
        remove.setAttribute('data-remove', `${index}-${taskList.indexOf(task)}`);
        remove.classList.add('delete-btn', 'delete-task');
        remove.textContent = '×';

        newTask.appendChild(remove);
        tasks.appendChild(tempContent);
    });
    updateTaskDeleteEvents();
}

displayTaskList(personal, 0);

//Add Project
const projectBtn = document.querySelector('.new-project-btn');
const projectInput = document.getElementById('add-project');

projectBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    if(projectInput.value === '') return;
    const newProject = Project();
    newProject.setName(projectInput.value.trim());
    myProjects.addProject(newProject);

    displayGroups(myGroups);
});

//Add Task
const taskBtn = document.querySelector('.new-task-btn');
const taskInput = document.getElementById('add-task');

taskBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    if(taskInput.value === '') return;
    const newTask = Task();
    newTask.setTitle(taskInput.value.trim());

    const index = e.target.dataset.target;

    const proj = myGroups[0].getProjects()[index];
    proj.addTask(newTask);

    displayTaskList(proj, index);
});

//Update EventListeners

function updateProjectDisplayEvent() {
    const projectList = document.querySelector('.projects-nav');
    const currentList = document.querySelector('.current-list');

    projectList.addEventListener('click', (e) => {
        const targ = e.target;
    
        if(!targ.dataset.index) return;
        const proj = myProjects.getProjects()[targ.dataset.index];

        displayTaskList(proj, targ.dataset.index);

        const btnTarget = document.querySelector('.new-task-btn');
        btnTarget.setAttribute('data-target', `${targ.dataset.index}`);

        currentList.dataset.current = targ.dataset.index;
    });

    const removeBtn = document.querySelectorAll('.delete-project');
    const title = document.getElementById('title');
    const tasks = document.querySelector('.task-list');

    removeBtn.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targ = e.target;
        
            if(!targ.dataset.remove) return;

            myGroups[0].removeProject(targ.dataset.remove);
            displayGroups(myGroups);

            if(currentList.dataset.current == targ.dataset.remove) {
                title.textContent = '';
                tasks.textContent = '';
            }
        })
    })
}

function updateTaskDeleteEvents() {
    const removeBtn = document.querySelectorAll('.delete-task');

    removeBtn.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targ = e.target;
        
            if(!targ.dataset.remove) return;
            if(!targ.dataset.remove.includes('-')) return;

            const indexes = targ.dataset.remove.split('-');
            console.log(myGroups[0].getProjects()[indexes[0]])
            myGroups[0].getProjects()[indexes[0]].removeTask(indexes[1]);

            const proj = myGroups[0].getProjects()[indexes[0]];
            displayTaskList(proj, indexes[0]);
        })
    })
}