<?php
	if (isset($_POST) && isset($_POST["test"])) { echo "[OK] " . $_POST["test"]; exit(); }
	else if (isset($HTTP_POST_VARS) && isset($HTTP_POST_VARS["test"])) { echo "[OK] " . $HTTP_POST_VARS["test"]; exit(); }
	else { echo "[ERROR] POST DATA CANNOT BE FOUND!"; exit(); }