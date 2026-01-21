console.log("JS connected");


// document → sayfanın kendisi
// querySelector → “bana şunu ver”
// JavaScript, DOM üzerinden HTML’i kontrol eder.
const form = document.querySelector("form");
const titleInput = document.querySelector("#taskTitle");
const descriptionInput = document.querySelector("#taskDescription");
const taskList = document.querySelector("#task-list");

console.log(form, titleInput, descriptionInput, taskList);

let tasks = [];

// DOM çizme fonksiyonu:
function addTaskToDOM(task, index){
   const li = document.createElement("li");

   const strong = document.createElement("strong");
   strong.textContent = task.title;

   const p = document.createElement("p");
   p.textContent = task.description;

   const deleteBtn = document.createElement("button");
   deleteBtn.textContent = "❌";

   const checkbox = document.createElement("input");
   checkbox.type= "checkbox";
   checkbox.checked = task.completed;


   // Checkbox event:
   checkbox.addEventListener("change", function () { // event adı change (bu satır şu anlama geliyor. “Checkbox’ın durumu değiştiğinde bu fonksiyonu çalıştır.”)
     console.log("Task Completed butonuna basıldı.")

     tasks[index].completed = checkbox.checked;
     console.log(index);

     localStorage.setItem("tasks", JSON.stringify(tasks));
 
     li.classList.toggle("completed", checkbox.checked);
     /*
    if (checkbox.checked){
        li.classList.add("completed")
    }
    else{
        li.classList.remove("completed")
    }
    toggle aslında buradaki if-else'nin kısa hali 
     */
   });

  // Delete event
  deleteBtn.addEventListener("click", function () {
    tasks.splice(index, 1); //index, sildiğin task’ın tasks array’indeki sırası. array.splice(nereden, kaçTane) siler. Data’dan gerçekten siliyor. Bu olmadan: localStorage güncellenemez, silme kalıcı olmaz.
    localStorage.setItem("tasks", JSON.stringify(tasks)); //“GÜNCELLENMİŞ task listesini tekrar kaydet” demek. Yani silinen task artık yok.
    li.remove(); // Bu da sadece görseltemizlik, kullanıcı silindei görsün diye.
    // Sıra şu şekilde:
    // Data'yı sil --> Yeni Data'yı kaydet --> Ekranı Güncelle
    /*
    Tek cümlelik özet:
        splice → gerçek silme
        localStorage.setItem → kalıcı kayıt
        li.remove() → sadece görüntü
        sıra bu yüzden önce data, sonra UI
    */
  });

  if (task.completed) {
    li.classList.add("completed");
  }

  // Bu oluşturduğumuz başlık ve descriptionları task list için oluşturduğumuz listeye ekleme kısmı:
  li.appendChild(checkbox);
  li.appendChild(strong);
  li.appendChild(p);
  li.appendChild(deleteBtn);

  // bu listeyi de task list'e ekleme kısmı
  taskList.appendChild(li);
}


form.addEventListener("submit", function (event){
// Butona basıyorsun -> Form submit oluyor -> Sayfa yenilenmek istiyor -> preventDefault() diyor ki: “Dur, yenilenme”
    event.preventDefault();
    console.log("Form submit edildi.");

    const title = titleInput.value;
    const description = descriptionInput.value;

    if (title === ""){ // title boşsa hiçbir şey yapma  
        return;
    }

    console.log(title,description)


    // Data'yı Local Storage'a kaydetme kısmı böylece sayfa yenilendiğinde bile bu veriler hala kalıyor olacak.
    const newTask = {
        title: title,
        description: description,
        completed: false
    };

    tasks.push(newTask);

    localStorage.setItem("tasks", JSON.stringify(tasks));
    
    addTaskToDOM(newTask, tasks.length-1);
    
    // inputları task liste eklendikten sonra siliyoruz:
    titleInput.value = ""
    descriptionInput.value = ""

    localStorage.setItem("test", "Merhaba Betül");
    console.log(localStorage.getItem("test")); 
})

// Sayfa açılınca LocalStorage’tan okuma
const savedTasks = localStorage.getItem("tasks");

if (savedTasks){
    tasks = JSON.parse(savedTasks)

    tasks.forEach(function(task, index){
        addTaskToDOM(task, index);
    });
}