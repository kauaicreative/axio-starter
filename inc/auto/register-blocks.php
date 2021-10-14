<?php
/**
 * Allow all blocks. This makes inc > _conf > register-blocks.php obsolete
 */
add_filter( 'allowed_block_types_all', '__return_true', 100, 2 );
