<?php

namespace App\Exceptions;

use DomainException;

/**
 * Thrown when trying to modify a checklist (or one of its items) that is
 * closed or cancelled. Per docs/DOMAIN.md, a checklist in either of those
 * states is immutable.
 */
class ChecklistNotEditableException extends DomainException
{
    public static function forState(string $stateName): self
    {
        return new self("No se puede modificar una lista en estado \"{$stateName}\".");
    }
}
