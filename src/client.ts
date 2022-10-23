/**
 * A user
 */
class User {
    /**
     * When creating a new user, userCounter
     * will be used to determine the next user id.
     */
    private static userCounter: number = 1;

    /**
     * The unique id of the user.
     * Important: Do not confuse the user's id with their index in the user list.
     */
    public id: number;

    public givenName: string;
    public familyName: string;
    public userName: string;
    public creationTime: Date;

    constructor(givenName: string, familyName: string, userName:string) {
        // Shortcut Syntax: 1) Assign userCounter. 2) increment by 1.
        this.id = User.userCounter++;

        this.givenName = givenName;
        this.familyName = familyName;
        this.userName = userName;

        // `new Date()` creates a date object using the current date and time.
        this.creationTime = new Date();
    }
}

/**
 * A list of users.
 * This class is a simple database, which implements
 * the CRUD operators for a list of users.
 */
class UserList {
    /**
     * The array of users.
     */
    private users: User[];

    /**
     * Creates an empty user list.
     */
    constructor() {
        this.users = [];
    }

    /**
     * Returns the user list.
     * Using a private property and a "getter"-method
     * prevents reassignment of the user list.
     */
    getUsers(): User[] {
        return this.users;
    }

    /**
     * Adds a user to the user list.
     */
    addUser(user: User) {
        this.users.push(user);
    }

    /**
     * Deletes the user who is identified by the given id.
     * Returns `true` if the user could be found and deleted.
     */
    deleteUser(userId: number): boolean {
        // Search for a user that has the given id using a loop.
        for (let i = 0; i < this.users.length; i++) {
            // Check if the user's id matches the given id.
            if (this.users[i].id == userId) {
                // Remove the user from the array.
                this.users.splice(i, 1);
                // Return true, because the user was found.
                return true;
            }
        }
        // If the loop finishes without returning, the user could not be found.
        return false;
    }

    /**
     * Returns a single user which has the given user id.
     * Important: Do not confuse the user's id with their index in the user list.
     */
    getUser(userId: number): User | null {
        // Search for the user by using a loop.
        for (const user of this.users) {
            // Check if the user's id matches the given user id.
            if (userId === user.id) {
                // The id matches, so return the user.
                return user;
            }
        }
        // The user could not be found. Return `null`.
        return null;
    }

    /**
     * Updates the properties of a user who has the given user id.
     * Returns `true`, if the user was found and updated.
     * Returns `false` if no user was found.
     */
    editUser(userId: number, givenName: string, familyName: string, userName: string): boolean {
        // Search for the user using a loop
        for (const user of this.users) {
            // Check if the user's id matches the given user id.
            if (user.id === userId) {
                // User found. Update their properties by assigning the given values.
                user.givenName = givenName;
                user.familyName = familyName;
                user.userName = userName;

                // Return `true` because a user was found and updated.
                return true;
            }
        }

        // If the loop finishes without returning, no user was found. Return `false`.
        return false;
    }
}

/**
 * The user list.
 */
let userList = new UserList();

document.addEventListener("DOMContentLoaded", () => {
    // Add 3 demo entries for test purposes.
    userList.addUser(new User("Samuel", "Schepp", "samuel56"));
    userList.addUser(new User("Kevin", "Linne", "linne465"));
    userList.addUser(new User("Peter", "Kneisel", "peter_kneisel"));
    renderList();

    // Event handler of the add user button
    document.getElementById("add-user-form").addEventListener("submit", (event) => {
        event.preventDefault();
        let givenNameEl = document.getElementById("add-user-given-name") as HTMLInputElement;
        let familyNameEl = document.getElementById("add-user-family-name") as HTMLInputElement;
        let userNameEl = document.getElementById("add-user-user-name") as HTMLInputElement;
        let givenName = givenNameEl.value.trim();
        let familyName = familyNameEl.value.trim();
        let userName = userNameEl.value.trim();

        // Check, if any given value is empty.
        // Don't allow creation of users without given name or family name.
        if (givenName.length == 0 || familyName.length == 0) {
            addMessage("The given name or family name is empty.")
            return;
        }

        if (userName.length == 0) {
            addMessage("The username is empty.")
            return;
        }

        // Create the new user.
        let user = new User(givenName, familyName, userName);

        // Add the user to the user list.
        userList.addUser(user);
        addMessage("User added.");

        // Update the html
        renderList();

        // Clear the input fields
        givenNameEl.value = "";
        familyNameEl.value = "";
        userNameEl.value = "";
    });

    // Handler of the modal's 'save' button
    document.getElementById("edit-user-form").addEventListener("submit", (event) => {
        event.preventDefault();
        let idEl = document.getElementById("edit-user-id") as HTMLInputElement;
        let givenNameEl = document.getElementById("edit-user-given-name") as HTMLInputElement;
        let familyNameEl = document.getElementById("edit-user-family-name") as HTMLInputElement;
        let userNameEl = document.getElementById("edit-user-user-name") as HTMLInputElement;

        // Read the user's id from the hidden field.
        let userId = Number(idEl.value);

        // Perform the update
        userList.editUser(userId, givenNameEl.value.trim(), familyNameEl.value.trim(), userNameEl.value.trim());
        addMessage("User updated.");

        // Hide the modal window
        bootstrap.Modal.getInstance(document.getElementById("edit-user-modal")).hide();

        // Update the html
        renderList();
    });
});

/**
 * 1) Clears the user table.
 * 2) Adds all users to the table.
 */
function renderList() {
    let userListEl = document.getElementById("user-list");

    // Remove all entries from the table
    userListEl.replaceChildren();

    for (let user of userList.getUsers()) {
        // The new table row
        let tr = document.createElement("tr");

        // ID cell
        let tdId = document.createElement("td");
        tdId.innerText = user.id.toString();

        // Given name cell
        let tdGivenName = document.createElement("td");
        tdGivenName.innerText = user.givenName;

        // Family name cell
        let tdFamilyName = document.createElement("td");
        tdFamilyName.innerText = user.familyName;

        //Username cell
        let tdUserName = document.createElement("td");
        tdUserName.innerText = user.userName;

        // Creation date cell
        let tdDate = document.createElement("td");
        tdDate.innerText = user.creationTime.toLocaleString();

        // Buttons cell
        let tdButtons = document.createElement("td");

        // Delete button
        let deleteButton = document.createElement("button");
        deleteButton.className = "btn btn-danger"
        deleteButton.addEventListener("click", () => {
            userList.deleteUser(user.id);
            addMessage("User deleted.");
            renderList();
        });

        // Delete button icon
        let deleteButtonIcon = document.createElement("i");
        deleteButtonIcon.className = "fa-solid fa-trash";
        deleteButton.append(deleteButtonIcon);

        // Edit button
        let editButton = document.createElement("button");
        editButton.className = "btn btn-primary ms-3"
        editButton.addEventListener("click", () => {
            showEditModal(user);
        });

        // Edit button icon
        let editButtonIcon = document.createElement("i");
        editButtonIcon.className = "fa-solid fa-pen";
        editButton.append(editButtonIcon);

        // Adds the buttons to the button cell
        tdButtons.append(deleteButton, editButton);

        // Add the cells to the table row
        tr.append(tdId, tdGivenName, tdFamilyName, tdUserName, tdDate, tdButtons);

        // Add the table row to the table
        userListEl.append(tr);
    }

    // Die Anzahl der Nutzer
    let anzahlNutzer = userList.getUsers().length as number;

    /** um die Werte in per Entwicklerkonsole auszugeben;
     * console.log(anzahlNutzer);
     */

    let anzahlSpan = document.getElementById('anzahl');
    anzahlSpan.innerHTML = anzahlNutzer.toString();

    // Durchschnittliche Länge der Vornamen

    let vorNameArray = [];
    for (let user of userList.getUsers()) {
        let durchVor = user.givenName;
        vorNameArray.push(durchVor);
    }

    /** um die Werte in per Entwicklerkonsole auszugeben;
     * console.log(vorname_array);
     */

   // toFixed -> formatiert eine Gleitkommazahl zu einen String mit einer festen Zahl von Nachkommastellen
   let durchVorName = vorNameArray.join('').length / vorNameArray.length;
   let durchVorNameHtml = document.getElementById('durchLangVor');
    durchVorNameHtml.innerHTML = durchVorName.toFixed(2);

   // Durchschnittliche Länge der Nachnamen
   let nachNameArray = [];
   for (let user of userList.getUsers()) {
       let durchNach = user.familyName;
       nachNameArray.push(durchNach);
   }
    /** um die Werte in per Entwicklerkonsole auszugeben;
     * console.log(nachname_array);
     */

   // toFixed -> formatiert eine Gleitkommazahl zu einen String mit einer festen Zahl von Nachkommastellen
   let durchNachName = nachNameArray.join('').length / nachNameArray.length;
   let durchNachNameHtml = document.getElementById('durchLangNach');
   durchNachNameHtml.innerHTML = durchNachName.toFixed(2);

   // Die kleinste und die größte Nutzer ID
    let idArray = [];
    for (let user of userList.getUsers()) {
        let nutzerId = user.id;
        idArray.push(nutzerId);
    }

    /** um die Werte in per Entwicklerkonsole auszugeben;
     * console.log(idArray[0]);
     * console.log(idArray[userList.getUsers().length-1]);
     */

    //Die kleinste Nutzer ID
    let kleinsteIdHtml = document.getElementById('kleinsteId');
    kleinsteIdHtml.innerHTML = idArray[0];

    //Die größte Nutzer ID
    let groesteIdHtml = document.getElementById('groesteId');
    groesteIdHtml.innerHTML = idArray[userList.getUsers().length-1];
}

/**
* 1) Fills the modal window with the given user's data.
* 2) Opens the modal window.
*/
function showEditModal(user: User) {
    let idEl = document.getElementById("edit-user-id") as HTMLInputElement;
    let givenNameEl = document.getElementById("edit-user-given-name") as HTMLInputElement;
    let familyNameEl = document.getElementById("edit-user-family-name") as HTMLInputElement;
    let userNameEl = document.getElementById("edit-user-user-name") as HTMLInputElement;

    // Write the user's id into the hidden field.
    idEl.value = user.id.toString();

    // Write the user's data into the text fields.
    givenNameEl.value = user.givenName;
    familyNameEl.value = user.familyName;
    userNameEl.value = user.userName;

    // Initialise the modal functionality. Enables the methods `.show()` and `.hide()`.
    const modal = new bootstrap.Modal(document.getElementById("edit-user-modal"));

    // Show the modal window.
    modal.show();
}

/**
 * Creates a new alert message.
 */
function addMessage(message: string) {
    const messagesEl = document.getElementById('messages');

    // The alert element
    let alertEl: HTMLElement = document.createElement('div')
    alertEl.classList.add('alert', 'alert-warning', 'alert-dismissible', 'fade', 'show');
    alertEl.setAttribute('role', 'alert');
    alertEl.innerText = message;

    // Close button
    let buttonEl: HTMLElement = document.createElement("button");
    // btn-close changes the button into an 'X' icon.
    buttonEl.className = "btn-close";
    // data-bs-dismiss enables the button to automatically close the alert on click.
    buttonEl.setAttribute("data-bs-dismiss", "alert");

    // Add the close button to the alert.
    alertEl.appendChild(buttonEl);

    // Convert to Bootstrap Alert type
    const alert = new bootstrap.Alert(alertEl);

    // Add message to DOM
    messagesEl.appendChild(alertEl);

    // Auto-remove message after 5 seconds (5000ms)
    setTimeout(() => {
        alert.close();
    }, 5000);
}
