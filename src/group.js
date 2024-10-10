export default function Group() {
    let name = '';
    let projects = [];

    const getName = () => name;

    const getProjects = () => projects;

    const setName = (newName) => name = newName;

    const addProject = (project) => projects.push(project);

    const removeProject = (index) => projects.splice(index, 1);

    return {
        getName,
        getProjects,
        setName,
        addProject,
        removeProject
    };
}