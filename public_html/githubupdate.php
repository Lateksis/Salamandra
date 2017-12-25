<?php 
  try {
    $output = shell_exec("git pull 2>&1");
    print "Git pull done, output:\n";  
    print $output;

    $processUser = posix_getpwuid(posix_geteuid());

    print "\n\nProcess user:\n";  
    print $processUser['name'];
    print "\nFile user:\n";  
    print get_current_user();
    print "\n\nEND\n";   
  } catch(Exception $err) {
    var_dump($err->getMessage());
  }
?>
