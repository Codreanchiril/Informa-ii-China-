<?php
// ── Configurații bază de date ──────────────────────────────────
$servername = "localhost";
$username   = "root";
$password   = "";
$dbname     = "contact_db";

// ── Conexiune ─────────────────────────────────────────────────
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Conexiune eșuată: " . $conn->connect_error);
}

$mesaj_succes = "";
$mesaj_eroare = "";
$prenume      = "";

// ── Procesare POST ────────────────────────────────────────────
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Preluăm și curățăm datele
    $prenume = $conn->real_escape_string(trim($_POST['prenume'] ?? ''));
    $nume    = $conn->real_escape_string(trim($_POST['nume']    ?? ''));
    $email   = $conn->real_escape_string(trim($_POST['email']   ?? ''));
    $varsta  = $conn->real_escape_string(trim($_POST['varsta']  ?? ''));
    $tara    = $conn->real_escape_string(trim($_POST['tara']    ?? ''));
    $interes = $conn->real_escape_string(trim($_POST['interes'] ?? ''));
    $vizita  = $conn->real_escape_string(trim($_POST['vizita']  ?? ''));
    $surse_raw = isset($_POST['surse']) ? (array)$_POST['surse'] : [];
$surse = $conn->real_escape_string(implode(', ', $surse_raw));
    $rating  = $conn->real_escape_string(trim($_POST['rating']  ?? ''));
    $subiect = $conn->real_escape_string(trim($_POST['subiect'] ?? ''));
    $mesaj   = $conn->real_escape_string(trim($_POST['mesaj']   ?? ''));

    // Validare minimă
    if (empty($prenume) || empty($email) || empty($mesaj)) {
        $mesaj_eroare = "Te rugăm completează cel puțin prenumele, emailul și mesajul.";
    } else {
        $sql = "INSERT INTO mesaje_contact 
                    (prenume, nume, email, varsta, tara, interes, vizita, surse, rating, subiect, mesaj)
                VALUES 
                    ('$prenume', '$nume', '$email', '$varsta', '$tara', '$interes', '$vizita', '$surse', '$rating', '$subiect', '$mesaj')";

        if ($conn->query($sql) === TRUE) {
            $mesaj_succes = "Mulțumim, {$prenume}! Mesajul tău a fost trimis cu succes. ✓";
        } else {
            $mesaj_eroare = "Eroare la salvare: " . $conn->error;
        }
    }

    $conn->close();

    // Redirect înapoi la formular cu statusul corespunzător
    if (!empty($mesaj_succes)) {
        $param = "status=success&nume=" . urlencode($prenume);
    } else {
        $param = "status=error&msg=" . urlencode($mesaj_eroare);
    }

    header("Location: formular.html?" . $param);
    exit;
}

$conn->close();
?>