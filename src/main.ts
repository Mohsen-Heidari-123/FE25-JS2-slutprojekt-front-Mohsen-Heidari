import "./style.css";

import {
  getMembers,
  getAssignments,
  addMember,
  addAssignment,
  assignTask,
  markDone,
  deleteTask,
  deleteMember,
} from "./api";
import { type Assignment, type Member } from "./types";

let members: Member[] = [];
let tasks: Assignment[] = [];

const fetchData = async () => {
  members = await getMembers();
  tasks = await getAssignments();

  renderMembers();
  renderBoard();
};

const renderBoard = () => {
  const newCol = document.getElementById("new-column")!;
  const doingCol = document.getElementById("doing-column")!;
  const doneCol = document.getElementById("done-column")!;

  newCol.innerHTML = "";
  doingCol.innerHTML = "";
  doneCol.innerHTML = "";

  tasks.forEach((task) => {
    const assignedMember = members.find((m) => m.id === task.assignedTo);

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
    <h4>${task.title}</h4>
    <p>${task.description}</p>
    <p>Category: ${task.category}</p>
    <p>${new Date(task.timestamp).toLocaleString()}</p>
    ${assignedMember ? `<p><strong>Assigned to:</strong> ${assignedMember.name}</p>` : ""}
  `;
    if (task.status === "new") {
      const select = document.createElement("select");

  
      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.textContent = "Assign to member";
      defaultOption.disabled = true;
      defaultOption.selected = true;
      select.appendChild(defaultOption);

      const filtered = members.filter((m) => m.category === task.category);

      filtered.forEach((m) => {
        const option = document.createElement("option");
        option.value = m.id;
        option.textContent = m.name;
        select.appendChild(option);
      });

      select.addEventListener("change", async () => {
        if (!select.value) return;

        await assignTask(task.id, select.value);
        fetchData();
      });

      card.appendChild(select);
      newCol.appendChild(card);
    }

    if (task.status === "doing") {
      const btn = document.createElement("button");
      btn.textContent = "Mark Done";
      btn.onclick = async () => {
        await markDone(task.id);
        fetchData();
      };
      card.appendChild(btn);
      doingCol.appendChild(card);
    }

    if (task.status === "done") {
      const btn = document.createElement("button");
      btn.textContent = "Delete";
      btn.onclick = async () => {
        await deleteTask(task.id);
        fetchData();
      };
      card.appendChild(btn);
      doneCol.appendChild(card);
    }
  });
};


document.getElementById("add-member")!.onclick = async () => {
  const name = (document.getElementById("member-name") as HTMLInputElement)
    .value;
  const category = (
    document.getElementById("member-category") as HTMLSelectElement
  ).value;
  (document.getElementById("member-name") as HTMLInputElement).value = "";
  await addMember(name, category);
  fetchData();
};

document.getElementById("add-task")!.onclick = async () => {
  const title = (document.getElementById("task-title") as HTMLInputElement)
    .value;
  const desc = (document.getElementById("task-desc") as HTMLTextAreaElement)
    .value;
  const category = (
    document.getElementById("task-category") as HTMLSelectElement
  ).value;
  (document.getElementById("task-title") as HTMLInputElement).value = "";
  (document.getElementById("task-desc") as HTMLTextAreaElement).value = "";
  await addAssignment(title, desc, category);
  fetchData();
};

const renderMembers = () => {
  const memberList = document.getElementById("member-list")!;
  memberList.innerHTML = "";

  members.forEach((member) => {
    const div = document.createElement("div");
    div.className = "member-card";

    const assignedTasks = tasks.filter((t) => t.assignedTo === member.id);

    div.innerHTML = `
      <strong>${member.name}</strong> (${member.category})
      <span>Tasks: ${assignedTasks.length}</span>
    `;

    if (assignedTasks.length === 0) {
      const btn = document.createElement("button");
      btn.textContent = "Delete";

      btn.onclick = async () => {
        await deleteMember(member.id);
        fetchData();
      };

      div.appendChild(btn);
    }

    memberList.appendChild(div);
  });
};

fetchData();
