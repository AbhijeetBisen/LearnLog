function validateForm() {

  const password =
    document.getElementById("password").value;

  const confirmPassword =
    document.getElementById("confirmPassword").value;

  if (password.length < 6) {

    alert(
      "Password must be at least 6 characters long."
    );

    return false;
  }

  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{6,}$/;

  if (!strongPasswordRegex.test(password)) {

    alert(
      "Password must contain uppercase, lowercase, and number."
    );

    return false;
  }

  if (password !== confirmPassword) {

    alert(
      "Passwords do not match."
    );

    return false;
  }

  return true;
}