console.log("JS connected");

// document → sayfanın kendisi (DOM Object)
// querySelector → “bana şunu ver” (DOM Selection Method)
// JavaScript, DOM üzerinden HTML’i kontrol eder.
// DOM Elemanlarını Yakalama:
const form = document.querySelector("form"); // <form> etiketi 
const titleInput = document.querySelector("#taskTitle");
const descriptionInput = document.querySelector("#taskDescription");
const taskList = document.querySelector("#task-list"); // "#" id demek

// Seçilen elemanları kontrol etme
console.log(form, titleInput, descriptionInput, taskList); // Multiple console.log
console.log(taskList.innerHTML);

let tasks = []; // Task’leri tutacak veri yapısı (Tüm görevlerin bellekte tutulduğu yer.)


// Functions:

// LOCAL STORAGE → STATE (Yani Ekrana getirmeden önce (DOM'a yansıtmadan önce) veriyi çekiyoruz localStprage'dan)
function loadTasks() {
    const saved = localStorage.getItem("tasks")
    tasks = saved ? JSON.parse(saved) : [];
}

// LOCAL STORAGE → STATE (state değiştiyse yani DOM'da değiştiyse localStorage'a kaydet)
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// RENDER (STATE → DOM)
function renderTasks() {
    // innerHTML bir DOM özelliğidir. Bir HTML elemanının içindeki her şeyi temsil eder. 
    taskList.innerHTML = ""; // önce temizle. Bu elemanın içindeki HER ŞEYİ SİL. Yani eski ekranı komple sil, sonra tasks arrayine bak ve baştan doğru yeniden çiz.
    tasks.forEach(task => {
        addTaskToDOM(task);
    });
}


// DOM’a task ekleyen fonksiyon: Bir task’ı alıp: HTML elemanlarını oluşturur, sayfaya ekler
function addTaskToDOM(task) {
    // createElement() → DOM Creation (HTML’de önceden yok olan elemanları JS ile üretir.)
    const li = document.createElement("li");

    const strong = document.createElement("strong");
    strong.textContent = task.title;

    const p = document.createElement("p");
    p.textContent = task.description;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;


    // Checkbox event (tamamlandı mı?):
    checkbox.addEventListener("change", function () { // event adı change (bu satır şu anlama geliyor. “Checkbox’ın durumu değiştiğinde bu fonksiyonu çalıştır.”)
        console.log("Task Completed butonuna basıldı.")

        const taskIndex = tasks.findIndex(t => t.id === task.id); // t → o anda dolaşılan eleman
        tasks[taskIndex].completed = checkbox.checked;  // .completed --> Task objesinin özelliği
        console.log(taskIndex);
        saveTasks();
        //localStorage.setItem("tasks", JSON.stringify(tasks)); // Güncellenmiş tasks array’i String’e çevrilir. Tarayıcıya kalıcı olarak kaydedilir
        // NEDEN burada? Çünkü: Checkbox’a tıklandı → data değişti. Data değişti → hemen kaydet
        // Olmasaydı? Checkbox işaretlenir. Sayfa yenilenir. Her şey geri gider
        renderTasks()
        //li.classList.toggle("completed", checkbox.checked); // Checkbox true ise: completed class’ı ekler. False ise: kaldırır
        /*
       // Yukarıdaki toggle'nin uzun hali:
       if (checkbox.checked){
           li.classList.add("completed")
       }
       else{
           li.classList.remove("completed")
       }
       toggle aslında buradaki if-else'nin kısa hali 
        */
    });

    // NOT: DOM elemanı nerede oluşturuluyorsa, ona ait event orada yazılır
    // Delete event
    deleteBtn.addEventListener("click", function () {
        // Sırayla:
        // 1) Data’dan siler
        // 2) Kalıcı olarak kaydeder
        // 3) Ekrandan kaldırır
        const taskIndex = tasks.findIndex(t => t.id === task.id);
        tasks.splice(taskIndex, 1); //index, sildiğin task’ın tasks array’indeki sırası. array.splice(nereden, kaçTane) siler. Data’dan gerçekten siliyor. Bu olmadan: localStorage güncellenemez, silme kalıcı olmaz.
        saveTasks();
        renderTasks();
        //localStorage.setItem("tasks", JSON.stringify(tasks)); //“GÜNCELLENMİŞ task listesini tekrar kaydet” demek. Yani silinen task artık yok.
        //li.remove(); // Bu da sadece görseltemizlik, kullanıcı silindei görsün diye.
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


form.addEventListener("submit", function (event) {
    // Butona basıyorsun -> Form submit oluyor -> Sayfa yenilenmek istiyor -> preventDefault() diyor ki: “Dur, yenilenme”
    event.preventDefault();
    console.log("Form submit edildi.");

    const title = titleInput.value;
    const description = descriptionInput.value;

    if (title === "") { // title boşsa hiçbir şey yapma  
        return;
    }

    console.log(title, description)


    // Data'yı Local Storage'a kaydetme kısmı böylece sayfa yenilendiğinde bile bu veriler hala kalıyor olacak.
    const newTask = {
        id: Date.now(),
        title: title,
        description: description,
        completed: false
    };

    tasks.push(newTask);

    //localStorage.setItem("tasks", JSON.stringify(tasks));
    saveTasks();

    //addTaskToDOM(newTask);
    renderTasks();

    // inputları task liste eklendikten sonra siliyoruz:
    titleInput.value = ""
    descriptionInput.value = ""

    // Test
    localStorage.setItem("test", "Merhaba Betül");
    console.log(localStorage.getItem("test"));
})

// Sayfa açılınca LocalStorage’tan okuma ve veriyi geri yükleme
const savedTasks = localStorage.getItem("tasks");

if (savedTasks) {
    tasks = JSON.parse(savedTasks)

    tasks.forEach(function (task) {
        addTaskToDOM(task);
    });
}

console.log("all tasks", tasks)